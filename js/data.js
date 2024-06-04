// 删去了一些无意义词汇“一个”“真的”“感觉”，以及一些负面词汇“骗子”“不好”
var wordsdata = {
    'name':'Top15_cities',
    'children':[
        {
            'name':'北京迁出',
            'children':[
                {
                    'name':'赤峰',
                    'children':[
                        {"name": "赤峰", "value": 360},
                        {"name": "城市", "value": 89},
                        {"name": "文化", "value": 52},
                        {"name": "房价", "value": 45},
                        {"name": "北京", "value": 40},
                        {"name": "发展", "value": 36},
                        {"name": "家乡", "value": 29},
                        {"name": "内蒙", "value": 26},
                        {"name": "经济", "value": 24},
                        {"name": "生活", "value": 24},
                        {"name": "人口", "value": 24},
                        {"name": "东北", "value": 23},
                        {"name": "红山", "value": 22},
                        {"name": "大学", "value": 21},
                        {"name": "草原", "value": 20},
                        {"name": "教育", "value": 20},
                        {"name": "工资", "value": 20}
                    ]                    
                },
                {
                    'name':'葫芦岛',
                    'children':[
                        {"name": "兴城", "value": 8},
                        {"name": "辽宁省", "value": 5},
                        {"name": "海港", "value": 4},
                        {"name": "杨翠杰", "value": 4},
                        {"name": "葫芦岛", "value": 8},
                        {"name": "城市", "value": 3},
                        {"name": "盘锦", "value": 3},
                        {"name": "工商业", "value": 3},
                        {"name": "联合会", "value": 3},
                        {"name": "主席", "value": 3},
                        {"name": "工作", "value": 3},
                        {"name": "工资", "value": 3},
                        {"name": "规模", "value": 2},
                        {"name": "比丹", "value": 2},
                        {"name": "大营", "value": 2},
                        {"name": "区位", "value": 2},
                        {"name": "两面", "value": 2},
                        {"name": "虹吸", "value": 2}
                    ]                    
                },
                {
                    'name':'德州',
                    'children':[
                        {"name": "德州", "value": 23},
                        {"name": "扒鸡", "value": 7},
                        {"name": "济南", "value": 5},
                        {"name": "中国", "value": 4},
                        {"name": "山东", "value": 3},
                        {"name": "驴肉", "value": 2},
                        {"name": "烧鸡", "value": 2},
                        {"name": "北京", "value": 2}
                    ]                    
                },
                {
                    'name':'大同',
                    'children':[
                        {"name": "大同", "value": 457},
                        {"name": "城市", "value": 119},
                        {"name": "古城", "value": 73},
                        {"name": "城墙", "value": 64},
                        {"name": "历史", "value": 55},
                        {"name": "北京", "value": 51},
                        {"name": "云冈石窟", "value": 50},
                        {"name": "旅游", "value": 42},
                        {"name": "恒山", "value": 40},
                        {"name": "山西", "value": 39},
                        {"name": "北魏", "value": 38},
                        {"name": "发展", "value": 38},
                        {"name": "悬空寺", "value": 37},
                        {"name": "华严寺", "value": 34},
                        {"name": "喜欢", "value": 31},
                        {"name": "刀削面", "value": 29},
                        {"name": "凉粉", "value": 29},
                        {"name": "美食", "value": 28}
                    ]
                },
                {
                    'name':'济南',
                    'children':[
                        {"name": "济南", "value": 3240},
                        {"name": "城市", "value": 858},
                        {"name": "山东", "value": 274},
                        {"name": "济南人", "value": 255},
                        {"name": "趵突泉", "value": 240},
                        {"name": "喜欢", "value": 240},
                        {"name": "青岛", "value": 228},
                        {"name": "大明湖", "value": 219},
                        {"name": "泉水", "value": 216},
                        {"name": "生活", "value": 192},
                        {"name": "发展", "value": 184},
                        {"name": "省会", "value": 173},
                        {"name": "工作", "value": 155},
                        {"name": "大学", "value": 137},
                        {"name": "泉城", "value": 136},
                        {"name": "经济", "value": 135},
                        {"name": "地铁", "value": 131},
                        {"name": "北京", "value": 125}
                    ]
                }
            ]
        },
        {
            'name':'广州迁出',
            'children':[
                {
                    'name':'茂名',
                    'children':[
                        {"name": "茂名", "value": 23},
                        {"name": "城市", "value": 9},
                        {"name": "不错", "value": 7},
                        {"name": "广州", "value": 6},
                        {"name": "生活", "value": 6},
                        {"name": "味道", "value": 6},
                        {"name": "鸡汤", "value": 5},
                        {"name": "外卖", "value": 5},
                        {"name": "大城市", "value": 4},
                        {"name": "老店", "value": 4},
                        {"name": "一线", "value": 4},
                        {"name": "物价", "value": 3},
                        {"name": "快餐", "value": 3},
                        {"name": "价格", "value": 3},
                        {"name": "便宜", "value": 3}
                    ]                    
                },
                {
                    'name':'湛江',
                    'children':[
                        {"name": "湛江", "value": 508},
                        {"name": "城市", "value": 146},
                        {"name": "赤坎", "value": 76},
                        {"name": "广州湾", "value": 70},
                        {"name": "建筑", "value": 66},
                        {"name": "广东", "value": 66},
                        {"name": "发展", "value": 54},
                        {"name": "雷州", "value": 50},
                        {"name": "法国", "value": 44},
                        {"name": "霞山", "value": 40},
                        {"name": "历史", "value": 37},
                        {"name": "广州", "value": 35},
                        {"name": "博物馆", "value": 31},
                        {"name": "特别", "value": 31},
                        {"name": "旧址", "value": 31},
                        {"name": "公园", "value": 29},
                        {"name": "老街", "value": 29}
                    ]                    
                },
                {
                    'name':'赣州',
                    'children':[
                        {"name": "赣州", "value": 1204},
                        {"name": "城市", "value": 332},
                        {"name": "江西", "value": 243},
                        {"name": "发展", "value": 164},
                        {"name": "南昌", "value": 129},
                        {"name": "经济", "value": 123},
                        {"name": "人口", "value": 81},
                        {"name": "喜欢", "value": 72},
                        {"name": "生活", "value": 69},
                        {"name": "中心", "value": 68},
                        {"name": "赣南", "value": 67},
                        {"name": "房价", "value": 63},
                        {"name": "文化", "value": 62},
                        {"name": "地区", "value": 56},
                        {"name": "中国", "value": 56},
                        {"name": "客家", "value": 56},
                        {"name": "工作", "value": 51}
                    ]                    
                },
                {
                    'name':'揭阳',
                    'children':[
                        {"name": "揭阳", "value": 403},
                        {"name": "城市", "value": 80},
                        {"name": "普宁", "value": 59},
                        {"name": "发展", "value": 47},
                        {"name": "汕头", "value": 44},
                        {"name": "潮汕", "value": 41},
                        {"name": "市区", "value": 34},
                        {"name": "喜欢", "value": 34},
                        {"name": "惠来", "value": 33},
                        {"name": "潮州", "value": 32},
                        {"name": "生活", "value": 29},
                        {"name": "经济", "value": 28},
                        {"name": "广州", "value": 26},
                        {"name": "进贤", "value": 20},
                        {"name": "榕城", "value": 20},
                        {"name": "特别", "value": 19},
                        {"name": "交通", "value": 19}
                    ]                    
                },
                {
                    'name':'梅州',
                    'children':[
                        {"name": "梅州", "value": 453},
                        {"name": "生活", "value": 101},
                        {"name": "城市", "value": 77},
                        {"name": "发展", "value": 63},
                        {"name": "客家人", "value": 54},
                        {"name": "客家", "value": 40},
                        {"name": "青年", "value": 40},
                        {"name": "工作", "value": 39},
                        {"name": "创业", "value": 39},
                        {"name": "广东", "value": 38},
                        {"name": "梅县", "value": 25},
                        {"name": "特别", "value": 24},
                        {"name": "喜欢", "value": 23},
                        {"name": "文化", "value": 22},
                        {"name": "人口", "value": 22},
                        {"name": "家乡", "value": 22}
                    ]                    
                }
            ]
        },
        {
            'name':'上海迁出',
            'children':[
                {
                    'name':'淮安',
                    'children':[
                        {"name": "淮安", "value": 308},
                        {"name": "城市", "value": 66},
                        {"name": "淮阴", "value": 35},
                        {"name": "发展", "value": 27},
                        {"name": "市区", "value": 27},
                        {"name": "江苏", "value": 21},
                        {"name": "清江浦", "value": 21},
                        {"name": "运河", "value": 20},
                        {"name": "漕运", "value": 20},
                        {"name": "未来", "value": 20},
                        {"name": "历史", "value": 19},
                        {"name": "经济", "value": 19},
                        {"name": "中国", "value": 17},
                        {"name": "淮扬菜", "value": 17},
                        {"name": "南京", "value": 17},
                        {"name": "南北", "value": 16},
                        {"name": "楚州", "value": 16}
                    ]                                     
                },
                {
                    'name':'宿迁',
                    'children':[
                        {"name": "宿迁", "value": 99},
                        {"name": "城市", "value": 35},
                        {"name": "上海", "value": 17},
                        {"name": "环境", "value": 14},
                        {"name": "工作", "value": 12},
                        {"name": "江苏", "value": 20},
                        {"name": "发展", "value": 10},
                        {"name": "全国", "value": 10},
                        {"name": "张新实", "value": 10},
                        {"name": "市长", "value": 9},
                        {"name": "房价", "value": 8},
                        {"name": "经济", "value": 8},
                        {"name": "大学", "value": 8},
                        {"name": "物价", "value": 8},
                        {"name": "不错", "value": 7},
                        {"name": "工资", "value": 7},
                        {"name": "公园", "value": 6},
                        {"name": "投资", "value": 6},
                        {"name": "干净", "value": 6}
                    ]                                      
                },
                {
                    'name':'阜阳',
                    'children':[
                        {"name": "阜阳", "value": 163},
                        {"name": "城市", "value": 35},
                        {"name": "苏轼", "value": 24},
                        {"name": "壮丁", "value": 17},
                        {"name": "博物馆", "value": 14},
                        {"name": "人口", "value": 13},
                        {"name": "房价", "value": 12},
                        {"name": "安徽", "value": 12},
                        {"name": "发展", "value": 10},
                        {"name": "格拉", "value": 10},
                        {"name": "抗战", "value": 10},
                        {"name": "市斤", "value": 10},
                        {"name": "颍州", "value": 9},
                        {"name": "政府", "value": 9},
                        {"name": "经济", "value": 9},
                        {"name": "文化", "value": 9},
                        {"name": "上海", "value": 9},
                        {"name": "历史", "value": 8}
                    ]                                 
                },
                {
                    'name':'连云港',
                    'children':[
                        {"name": "连云港", "value": 172},
                        {"name": "城市", "value": 60},
                        {"name": "发展", "value": 45},
                        {"name": "文化", "value": 25},
                        {"name": "江苏", "value": 23},
                        {"name": "赣榆", "value": 20},
                        {"name": "灌云", "value": 20},
                        {"name": "东海", "value": 19},
                        {"name": "高中", "value": 19},
                        {"name": "南京", "value": 16},
                        {"name": "地区", "value": 16},
                        {"name": "港口", "value": 15},
                        {"name": "老师", "value": 15},
                        {"name": "新海", "value": 15},
                        {"name": "家乡", "value": 15},
                        {"name": "工作", "value": 14},
                        {"name": "生活", "value": 14},
                        {"name": "市区", "value": 14}
                    ]                    
                },
                {
                    'name':'六安',
                    'children':[
                        {"name": "六安", "value": 354},
                        {"name": "城市", "value": 108},
                        {"name": "大别山", "value": 38},
                        {"name": "瓜片", "value": 36},
                        {"name": "合肥", "value": 35},
                        {"name": "中国", "value": 30},
                        {"name": "好吃", "value": 29},
                        {"name": "皖西", "value": 26},
                        {"name": "安徽", "value": 25},
                        {"name": "喜欢", "value": 24},
                        {"name": "美食", "value": 22},
                        {"name": "当地", "value": 22},
                        {"name": "天堂寨", "value": 19},
                        {"name": "霍山", "value": 19},
                        {"name": "包子", "value": 19},
                        {"name": "金寨", "value": 18},
                        {"name": "高铁", "value": 18},
                        {"name": "视觉", "value": 17}
                    ]                    
                }
            ]
        }
    ]
}