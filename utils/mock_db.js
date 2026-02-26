// utils/mock_db.js

const DISHES_KEY = 'dishes';
const ORDERS_KEY = 'orders';

const initialDishes = [
  {
    id: 'd1',
    name: '糖醋排骨',
    image: 'https://via.placeholder.com/300x300.png?text=Pork+Ribs',
    recipe: '1. 排骨焯水\n2. 炒糖色\n3. 焖煮40分钟',
    tags: ['荤菜', '妈妈拿手']
  },
  {
    id: 'd2',
    name: '番茄炒蛋',
    image: 'https://via.placeholder.com/300x300.png?text=Tomato+Eggs',
    recipe: '先炒蛋，再炒番茄，最后混合',
    tags: ['素菜', '快手菜']
  },
  {
    id: 'd3',
    name: '玉米排骨汤',
    image: 'https://via.placeholder.com/300x300.png?text=Soup',
    recipe: '全部放入电饭煲炖2小时',
    tags: ['汤羹']
  },
  {
    id: 'd4',
    name: '红烧肉',
    image: 'https://via.placeholder.com/300x300.png?text=Pork+Belly',
    recipe: '五花肉切块，慢火炖',
    tags: ['荤菜']
  },
  {
    id: 'd5',
    name: '清炒时蔬',
    image: 'https://via.placeholder.com/300x300.png?text=Vegetables',
    recipe: '大火快炒',
    tags: ['素菜']
  },
  {
    id: 'd6',
    name: '蛋炒饭',
    image: 'https://via.placeholder.com/300x300.png?text=Fried+Rice',
    recipe: '隔夜饭最好',
    tags: ['主食']
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

function getLocalTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function submitOrder(selectedDishIds) {
  const today = getLocalTodayDate();
  const orders = wx.getStorageSync(ORDERS_KEY) || [];

  // Remove existing order for today if any (overwrite logic)
  const otherOrders = orders.filter(o => o.date !== today);

  const newOrder = {
    id: 'o' + Date.now(),
    date: today,
    dishes: selectedDishIds,
    status: 'pending', // pending, viewed
    created_at: Date.now()
  };

  otherOrders.push(newOrder);
  wx.setStorageSync(ORDERS_KEY, otherOrders);
  return newOrder;
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
  submitOrder,
  getTodaysOrder
};
