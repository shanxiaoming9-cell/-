// cloudfunctions/importDishes/index.js
const cloud = require('wx-server-sdk')
const xlsx = require('node-xlsx')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// Initialize database
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { fileID } = event

  try {
    // 1. Download file from cloud storage
    const res = await cloud.downloadFile({
      fileID: fileID,
    })
    const buffer = res.fileContent

    // 2. Parse Excel buffer
    const sheets = xlsx.parse(buffer) // Returns array of sheets
    const sheet = sheets[0] // Assume first sheet
    const data = sheet.data

    // 3. Process Rows (Skip header if necessary, here we assume data starts at row 0 or 1 based on user template)
    // Based on IMPORT_TEMPLATE.md: No header.
    // Column A: Name (index 0)
    // Column B: Recipe (index 1)
    // Column C: Tags (index 2, comma separated)

    const tasks = []
    const dishes = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length === 0) continue

      const name = row[0]
      if (!name) continue // Skip empty names

      const recipe = row[1] || ''
      const tagString = row[2] || '荤菜' // Default tag

      // Split tags by comma (support Chinese/English comma)
      const tags = tagString.toString().split(/[,，]/).map(t => t.trim()).filter(t => t)

      const dishData = {
        name: String(name),
        recipe: String(recipe),
        tags: tags.length > 0 ? tags : ['荤菜'],
        image: '', // Placeholder for image, updated by frontend or separate logic
        createTime: db.serverDate()
      }

      dishes.push(dishData)

      // Prepare DB insert promise
      const promise = db.collection('dishes').add({
        data: dishData
      })
      tasks.push(promise)
    }

    // 4. Wait for all database insertions to complete
    // In production, consider batching or handling partial failures
    const results = await Promise.all(tasks)

    return {
      success: true,
      count: results.length,
      data: dishes // Return parsed data for frontend verification
    }

  } catch (e) {
    console.error(e)
    return {
      success: false,
      errMsg: e.message
    }
  }
}
