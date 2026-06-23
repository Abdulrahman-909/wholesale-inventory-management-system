/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'appLanguage'

const translations = {
  en: {
  // ================= GENERAL =================
  appName: 'Whole Sale',
  loading: 'Loading...',
  dark: 'Dark',
  light: 'Light',
  language: 'Language',
  menu: 'Menu',

  // ================= NAVIGATION =================
  navDashboard: 'Dashboard',
  navPos: 'Point Of Sale',
  navProducts: 'Products',
  navCustomers: 'Customers',
  navSuppliers: 'Suppliers',
  navStock: 'Stock',
  navLedger: 'Ledger',
  navReports: 'Reports',
  navProfile: 'Profile',
  logout: 'Logout',

  // ================= AUTH =================
  signIn: 'Log In',
  createAccount: 'Create account',
  username: 'Username',
  email: 'Email',
  password: 'Password',
  register: 'Register',
  login: 'Login',
  newUser: 'New user?',
  haveAccount: 'Have an account?',

  // ================= HOME PAGE =================
  homeTag: 'Wholesale Inventory Management System',
  homeTitle: 'Run Store inventory, sales, and suppliers from one place',
  homeSubtitle:
    'Track products, monitor stock, manage customers and suppliers, and review daily sales with a faster and cleaner experience.',
  goDashboard: 'Go to dashboard',
  createAccountBtn: 'Create account',

  // ================= DASHBOARD =================
  dashboardTitle: 'Dashboard',
  dashboardSub: '',
  todaySales: 'Today Sales',
  todayRevenue: 'Today Revenue',
  totalProducts: 'Total Products',
  totalCustomers: 'Total Customers',
  quickActions: 'Quick Actions',
  addProduct: 'Add a product',
  openPos: 'Open POS',
  newPurchase: 'New Purchase',
  dailyReport: 'Daily Report',
  stockInsight: 'Stock Insight',
  stockInsightLoading: 'Loading stock insight...',
  lowStockProducts: 'Low stock products',
  dashboardEmptyHint:
    'If everything is zero, add products and start recording purchases/sales. Stats update from live API data.',
  viewProducts: 'View products',

  // ================= PROFILE =================
  profileTitle: 'Profile',
  profileSub: 'Account details for the currently signed-in user.',
  userId: 'User ID',
  role: 'Role',
  staffUser: 'Staff User',

  // ================= POS =================
  posTitle: 'Point of Sale',
  posSub: 'Create a sale with line items and submit directly to your backend.',
  buildSale: 'Build Sale',
  productLoadingFailed: 'Product loading failed',
  stock: 'Stock',
  cash: 'Cash',
  credit: 'Credit',
  customer: 'Customer',
  paymentType: 'Payment Type',
  dueDate: 'Due Date',
  selectCustomer: 'Select customer',
  selectProduct: 'Select product',
  qty: 'Qty',
  unitPrice: 'Unit price',
  addItem: 'Add Item',
  invoiceSummary: 'Invoice Summary',
  items: 'Items',
  total: 'Total',
  checkoutSale: 'Checkout Sale',
  submitting: 'Submitting...',
  saleSuccess: 'Sale recorded successfully',
  remove: 'Remove',
  noItemsYet: 'No items added yet.',
},
  fa: {
    appName: 'سیستم مدیریت مارکیت',
    navDashboard: 'داشبورد',
    navPos: 'فروش',
    navProducts: 'محصولات',
    navCustomers: 'مشتریان',
    navSuppliers: 'تأمین‌کنندگان',
    navStock: 'موجودی',
    navLedger: 'حسابات',
    navReports: 'گزارش‌ها',
    navProfile: 'پروفایل',
    logout: 'خروج',
    menu: 'منو',
    language: 'زبان',
    dark: 'تیره',
    light: 'روشن',
    loading: 'در حال بارگذاری...',
    signIn: 'ورود',
    createAccount: 'ایجاد حساب',
    username: 'نام کاربری',
    email: 'ایمیل',
    password: 'رمز عبور',
    register: 'ثبت‌نام',
    login: 'ورود',
    newUser: 'کاربر جدید؟',
    haveAccount: 'حساب دارید؟',
    homeTag: 'سیستم انبار عمده فروشی',
    homeTitle: 'مدیریت موجودی، فروش و تأمین‌کنندگان در یک جا',
    homeSubtitle:
      'محصولات را ثبت کنید، موجودی را ببینید، مشتری و تأمین‌کننده را مدیریت کنید و فروش روزانه را سریع‌تر بررسی نمایید.',
    goDashboard: 'رفتن به داشبورد',
    createAccountBtn: 'ایجاد حساب',
    addProduct: 'افزودن محصول',
    dashboardTitle: 'داشبورد',
    dashboardSub: 'نمای کلی فعالیت فروش و موجودی شما.',
    todaySales: 'فروش امروز',
    todayRevenue: 'درآمد امروز',
    totalProducts: 'کل محصولات',
    totalCustomers: 'کل مشتریان',
    quickActions: 'اقدامات سریع',
    openPos: 'بازکردن فروش',
    newPurchase: 'خرید جدید',
    dailyReport: 'گزارش روزانه',
    stockInsight: 'وضعیت موجودی',
    stockInsightLoading: 'در حال بارگذاری وضعیت موجودی...',
    lowStockProducts: 'محصولات کم‌موجود',
    dashboardEmptyHint:
      'اگر همه اعداد صفر است، ابتدا محصول اضافه کنید و خرید/فروش ثبت نمایید. آمار از API زنده به‌روزرسانی می‌شود.',
    viewProducts: 'مشاهده محصولات',
    profileTitle: 'پروفایل',
    profileSub: 'جزئیات حساب کاربر واردشده.',
    userId: 'شناسه کاربر',
    role: 'نقش',
    staffUser: 'کارمند',
    posTitle: 'صندوق فروش',
    posSub: 'فروش را با چند قلم ایجاد کنید و مستقیم به سرور ارسال نمایید.',
    buildSale: 'ساخت فروش',
    productLoadingFailed: 'بارگذاری محصولات ناموفق بود',
    stock: 'موجودی',
    cash: 'نقد',
    credit: 'قرض',
    customer: 'مشتری',
    paymentType: 'نوع پرداخت',
    dueDate: 'تاریخ سررسید',
    selectCustomer: 'انتخاب مشتری',
    selectProduct: 'انتخاب محصول',
    qty: 'تعداد',
    unitPrice: 'قیمت واحد',
    addItem: 'افزودن قلم',
    invoiceSummary: 'خلاصه فاکتور',
    items: 'اقلام',
    total: 'مجموع',
    checkoutSale: 'ثبت فروش',
    submitting: 'در حال ارسال...',
    saleSuccess: 'فروش موفقانه ثبت شد',
    remove: 'حذف',
    noItemsYet: 'هنوز قلمی اضافه نشده است.',
  },
  ps: {
    appName: 'د مارکېټ مدیریت سیستم',
    navDashboard: 'ډشبورډ',
    navPos: 'خرڅلاو',
    navProducts: 'توکي',
    navCustomers: 'پېرودونکي',
    navSuppliers: 'عرضه کوونکي',
    navStock: 'سټاک',
    navLedger: 'حسابونه',
    navReports: 'راپورونه',
    navProfile: 'پروفایل',
    logout: 'وتل',
    menu: 'مېنو',
    language: 'ژبه',
    dark: 'تیاره',
    light: 'روښانه',
    loading: 'بارېږي...',
    signIn: 'ننوتل',
    createAccount: 'اکاونټ جوړول',
    username: 'کارن نوم',
    email: 'برېښنالیک',
    password: 'پټنوم',
    register: 'راجستر',
    login: 'ننوتل',
    newUser: 'نوی کارن؟',
    haveAccount: 'اکاونټ لرئ؟',
    homeTag: 'د عمده خرڅلاو سټاک سیستم',
    homeTitle: 'سټاک، خرڅلاو او عرضه کوونکي په یو ځای کې مدیریت کړئ',
    homeSubtitle:
      'توکي ثبت کړئ، سټاک وڅارئ، پېرودونکي او عرضه کوونکي اداره کړئ او ورځنی خرڅلاو په چټک ډول وګورئ.',
    goDashboard: 'ډشبورډ ته لاړ شئ',
    createAccountBtn: 'اکاونټ جوړ کړئ',
    addProduct: 'توکی زیات کړئ',
    dashboardTitle: 'ډشبورډ',
    dashboardSub: 'ستاسو د سټاک او خرڅلاو لنډ وضعیت.',
    todaySales: 'د نن خرڅلاو',
    todayRevenue: 'د نن عاید',
    totalProducts: 'ټول توکي',
    totalCustomers: 'ټول پېرودونکي',
    quickActions: 'چټک کارونه',
    openPos: 'POS پرانستل',
    newPurchase: 'نوی پېرود',
    dailyReport: 'ورځنی راپور',
    stockInsight: 'د سټاک وضعیت',
    stockInsightLoading: 'د سټاک وضعیت بارېږي...',
    lowStockProducts: 'کم سټاک توکي',
    dashboardEmptyHint:
      'که ټول شمېرې صفر وي، لومړی توکي زیات کړئ او بیا پېرود/خرڅلاو ثبت کړئ. شمېرې د ژوندي API څخه نوي کېږي.',
    viewProducts: 'توکي وګورئ',
    profileTitle: 'پروفایل',
    profileSub: 'د اوسني ننوتلي کارن معلومات.',
    userId: 'کارن پېژند',
    role: 'دنده',
    staffUser: 'کارکوونکی',
    posTitle: 'خرڅلاو (POS)',
    posSub: 'خرڅلاو د څو توکو سره جوړ کړئ او مستقیم سرور ته یې واستوئ.',
    buildSale: 'خرڅلاو جوړول',
    productLoadingFailed: 'د توکو لوډ ناکام شو',
    stock: 'سټاک',
    cash: 'نغدي',
    credit: 'پور',
    customer: 'پېرودونکی',
    paymentType: 'د تادیې ډول',
    dueDate: 'د پور نېټه',
    selectCustomer: 'پېرودونکی وټاکئ',
    selectProduct: 'توکی وټاکئ',
    qty: 'تعداد',
    unitPrice: 'د واحد بیه',
    addItem: 'توکی زیات کړئ',
    invoiceSummary: 'د بل لنډیز',
    items: 'توکي',
    total: 'ټول',
    checkoutSale: 'خرڅلاو ثبت',
    submitting: 'استول کېږي...',
    saleSuccess: 'خرڅلاو په بریالیتوب ثبت شو',
    remove: 'لرې کول',
    noItemsYet: 'لا توکي نه دي زیات شوي.',
  },
}

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'fa' || saved === 'ps') return saved
  return 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fa' || language === 'ps' ? 'rtl' : 'ltr'
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t(key) {
        return translations[language]?.[key] ?? translations.en[key] ?? key
      },
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useI18n must be used inside LanguageProvider')
  return context
}
