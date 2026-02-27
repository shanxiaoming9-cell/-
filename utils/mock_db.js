// utils/mock_db.js

const { DEFAULT_DISH_IMG } = require('./assets.js');

const DISHES_KEY = 'dishes';
const ORDERS_KEY = 'orders';

// A rich, pre-populated list of Chinese home-style dishes with realistic images.
// Images are served via a reliable CDN or placeholder service that supports keywords.
// For this demo, we use specific Unsplash IDs known for food or high-quality placeholder services.
const initialDishes = [
  {
    id: 'd101',
    name: '红烧肉',
    image: 'https://images.unsplash.com/photo-1626804475297-411d8c66e285?w=500&q=80',
    recipe: '1. 五花肉切块焯水。\n2. 炒糖色至红亮。\n3. 加入肉块翻炒，加水慢炖45分钟。\n4. 大火收汁即可。',
    tags: ['荤菜', '妈妈拿手'],
    url: 'https://www.xiachufang.com/recipe/100570530/'
  },
  {
    id: 'd102',
    name: '番茄炒蛋',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500&q=80', // Tomato theme
    recipe: '1. 鸡蛋打散炒熟盛出。\n2. 番茄切块炒出汁。\n3. 倒入鸡蛋混合，加少许糖提鲜。',
    tags: ['素菜', '快手菜'],
    url: 'https://www.xiachufang.com/recipe/1000570/'
  },
  {
    id: 'd103',
    name: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1626202158693-02bf3a943703?w=500&q=80', // Steamed Fish
    recipe: '1. 鲈鱼改刀，铺姜葱。\n2. 水开后蒸8分钟。\n3. 倒掉腥水，淋蒸鱼豉油和热油。',
    tags: ['荤菜', '海鲜'],
    url: 'https://www.xiachufang.com/recipe/1000213/'
  },
  {
    id: 'd104',
    name: '可乐鸡翅',
    image: 'https://images.unsplash.com/photo-1626202378877-2e118320498a?w=500&q=80', // Chicken Wings
    recipe: '1. 鸡翅两面煎黄。\n2. 倒入可乐没过鸡翅。\n3. 中火煮至汤汁浓稠。',
    tags: ['荤菜', '孩子最爱'],
    url: 'https://www.xiachufang.com/recipe/1000427/'
  },
  {
    id: 'd105',
    name: '酸辣土豆丝',
    image: 'https://images.unsplash.com/photo-1625938146369-adc83229b64d?w=500&q=80', // Potato
    recipe: '1. 土豆切丝泡水去淀粉。\n2. 热油爆香干辣椒。\n3. 大火快炒，加醋爽脆。',
    tags: ['素菜', '开胃'],
    url: 'https://www.xiachufang.com/recipe/1065171/'
  },
  {
    id: 'd106',
    name: '玉米排骨汤',
    image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?w=500&q=80', // Soup
    recipe: '1. 排骨焯水。\n2. 玉米切段，胡萝卜切块。\n3. 一起放入砂锅炖1.5小时。',
    tags: ['汤羹', '养生'],
    url: 'https://www.xiachufang.com/recipe/1043292/'
  },
  {
    id: 'd107',
    name: '扬州炒饭',
    image: 'https://images.unsplash.com/photo-1596707328574-e3c35b8004f2?w=500&q=80', // Fried Rice
    recipe: '1. 准备隔夜饭、火腿丁、鸡蛋、青豆。\n2. 先炒配菜，再下米饭。\n3. 加盐和葱花翻炒均匀。',
    tags: ['主食'],
    url: 'https://www.xiachufang.com/recipe/1005886/'
  },
  {
    id: 'd108',
    name: '红烧茄子',
    image: 'https://images.unsplash.com/photo-1616666991056-2713f9906d4e?w=500&q=80', // Eggplant
    recipe: '1. 茄子切滚刀块，裹淀粉炸软。\n2. 调酱汁（生抽/老抽/糖/醋）。\n3. 炒香蒜末，下茄子和酱汁焖煮。',
    tags: ['素菜', '下饭'],
    url: 'https://www.xiachufang.com/recipe/1058721/'
  },
  {
    id: 'd109',
    name: '宫保鸡丁',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80', // Kung Pao Chicken
    recipe: '1. 鸡胸肉切丁腌制。\n2. 调好宫保汁。\n3. 炒熟鸡丁，下花生米和葱段，淋汁。',
    tags: ['荤菜', '经典'],
    url: 'https://www.xiachufang.com/recipe/1000179/'
  },
  {
    id: 'd110',
    name: '紫菜蛋花汤',
    image: 'https://images.unsplash.com/photo-1608651873133-88849646452e?w=500&q=80', // Simple Soup
    recipe: '1. 水烧开，放入紫菜。\n2. 淋入蛋液，关火。\n3. 加盐、香油、葱花。',
    tags: ['汤羹', '快手'],
    url: 'https://www.xiachufang.com/recipe/1004868/'
  },
  {
    id: 'd111',
    name: '肉末豆角',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&q=80', // Green Beans
    recipe: '1. 豆角切丁。\n2. 炒散肉末。\n3. 放入豆角丁炒熟，加揽菜提味。',
    tags: ['荤素菜', '下饭'],
    url: 'https://www.xiachufang.com/recipe/1001332/'
  },
  {
    id: 'd112',
    name: '西红柿鸡蛋面',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&q=80', // Noodle
    recipe: '1. 炒好西红柿鸡蛋卤。\n2. 煮好面条过凉水。\n3. 浇上卤汁。',
    tags: ['主食'],
    url: 'https://www.xiachufang.com/recipe/1000898/'
  }
];

function initDB() {
  const existingDishes = wx.getStorageSync(DISHES_KEY);
  if (!existingDishes || existingDishes.length === 0) {
    wx.setStorageSync(DISHES_KEY, initialDishes);
  }
}

function getDishes() {
  initDB(); // Ensure DB is initialized
  return wx.getStorageSync(DISHES_KEY) || [];
}

function addDish(dish) {
  const dishes = getDishes();
  const newDish = {
    id: 'd' + Date.now(),
    ...dish
  };
  dishes.push(newDish);
  wx.setStorageSync(DISHES_KEY, dishes);
  return newDish;
}

function updateDish(id, updatedFields) {
  const dishes = getDishes();
  const index = dishes.findIndex(d => d.id === id);
  if (index !== -1) {
    dishes[index] = { ...dishes[index], ...updatedFields };
    wx.setStorageSync(DISHES_KEY, dishes);
    return dishes[index];
  }
  return null;
}

function deleteDish(id) {
  const dishes = getDishes();
  const newDishes = dishes.filter(d => d.id !== id);
  wx.setStorageSync(DISHES_KEY, newDishes);
}

function getLocalTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function submitOrder(selectedDishIds) {
  const today = getLocalTodayDate();
  const orders = wx.getStorageSync(ORDERS_KEY) || [];

  // Check if order exists for today
  let orderIndex = orders.findIndex(o => o.date === today);
  let order;

  if (orderIndex !== -1) {
    // Accumulate dishes
    order = orders[orderIndex];
    // Use Set to avoid duplicates if desired, or just concat
    // Requirement says "accumulate", user might want to select same dish twice?
    // Let's assume unique for now to keep it clean, or concat if they want multiples.
    // Given context of "Meal Picker", usually you pick distinct dishes.
    const combined = [...new Set([...order.dishes, ...selectedDishIds])];
    order.dishes = combined;
    orders[orderIndex] = order;
  } else {
    // Create new
    order = {
      id: 'o' + Date.now(),
      date: today,
      dishes: selectedDishIds,
      status: 'pending', // pending, viewed
      created_at: Date.now()
    };
    orders.push(order);
  }

  wx.setStorageSync(ORDERS_KEY, orders);
  return order;
}

function removeDishFromOrder(dishId) {
    const today = getLocalTodayDate();
    const orders = wx.getStorageSync(ORDERS_KEY) || [];
    const orderIndex = orders.findIndex(o => o.date === today);

    if (orderIndex !== -1) {
        const order = orders[orderIndex];
        order.dishes = order.dishes.filter(id => id !== dishId);
        orders[orderIndex] = order;
        wx.setStorageSync(ORDERS_KEY, orders);
    }
}

function getTodaysOrder() {
  const today = getLocalTodayDate();
  const orders = wx.getStorageSync(ORDERS_KEY) || [];
  const order = orders.find(o => o.date === today);

  if (!order) return null;

  // Enrich with dish details
  const allDishes = getDishes();
  const detailedDishes = order.dishes.map(id => allDishes.find(d => d.id === id)).filter(Boolean);

  return {
    ...order,
    detailedDishes
  };
}

module.exports = {
  getDishes,
  addDish,
  updateDish,
  deleteDish,
  submitOrder,
  removeDishFromOrder,
  getTodaysOrder
};
