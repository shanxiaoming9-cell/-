# Family Meal Picker (亲子点餐助手)

A WeChat Mini Program to help children pick meals and moms to manage the menu.

## Features

- **Role Selection**: Choose between "Child" (Picker) and "Mom" (Admin).
- **Dish Management**: Mom can view, add, and manage dishes with photos and recipes.
- **Daily Picker**: Child can browse dishes in a waterfall layout, filter by category, and send their selection to Mom.
- **Order Summary**: Mom can instantly see the child's selection for the day.
- **Mock Database**: Data is persisted locally using `wx.setStorageSync` for demonstration purposes.

## How to Run

1.  Download this project.
2.  Open **WeChat Developer Tools** (微信开发者工具).
3.  Select **Import Project**.
4.  Choose the root directory of this project.
5.  If asked for AppID, you can use a Test AppID (测试号) or your own.
6.  Click **Compile** to run the simulator.

## Project Structure

- `pages/`: Contains all page logic and UI.
  - `index/`: Landing page.
  - `menu/`: Dish management (Mom).
  - `picker/`: Dish selection (Child).
  - `summary/`: Order overview (Mom).
- `components/`: Reusable UI components.
  - `dish-card/`: The card used in dish lists.
- `utils/`: Utility functions.
  - `mock_db.js`: Simulates cloud database operations.
- `app.json`: Global configuration.
- `app.wxss`: Global styles.

## Notes

- This version runs entirely client-side using local storage.
- To connect to a real backend, replace the functions in `utils/mock_db.js` with calls to `wx.cloud.database()`.
