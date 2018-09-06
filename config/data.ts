// 不限，1：应届生，2：1年以内，3:1-3年内，4:3-4年，5:5-10年，6:10年以上
export const EXPERIENCES_DATA = [
  {label: '不限', value: ''},
  {label: '应届生', value: '1'},
  {label: '1年以内', value: '2'},
  {label: '1-3年内', value: '3'},
  {label: '3-4年', value: '4'},
  {label: '5-10年', value: '5'},
  {label: '10年以上', value: '6'}
];

export const WORK_STATUSES_DATA = [
  {
    label: '离职-随时到岗',
    value: '1'
  },
  {
    label: '在职-考虑机会',
    value: '2'
  },
  {
    label: '在职-月内到岗',
    value: '3'
  },
  {
    label: '在职-暂不考虑',
    value: '4'
  }
];

export const STRENGTHS_DATA = [
  {label: '股票期权', value: '1'},
  {label: '带薪年假', value: '2'},
  {label: '年度旅游', value: '3'},
  {label: '不打卡', value: '4'},
  {label: '年终分红', value: '5'},
  {label: '免费零食', value: '6'},
  {label: '美女如云', value: '7'},
  {label: '扁平管理', value: '8'},
  {label: '地铁周边', value: '9'},
  {label: '领导亲切', value: '10'},
  {label: '电子商务', value: '11'},
  {label: '移动广告', value: '12'},
  {label: '移动互联网', value: '13'},
  {label: '互联网金融', value: '14'},
  {label: '智能硬件', value: '15'},
  {label: '包食宿', value: '16'},
  {label: '弹性上下班', value: '17'},
  {label: '五险一金', value: '18'},
  {label: '朝九晚六', value: '19'}
];

// 公司规模
export const SCOPE_DATA = [
  {label: '0-20人', value: '1'},
  {label: '20-100人', value: '2'},
  {label: '100-500人', value: '3'},
  {label: '500-1000人', value: '4'},
  {label: '1000-10000', value: '5'},
  {label: '10000人以上', value: '6'}
];

export const FINANCE_DATA = [
  {label: '不需要融资', value: '0'},
  {label: '未融资', value: '1'},
  {label: '天使轮', value: '2'},
  {label: 'A轮', value: '3'},
  {label: 'B轮', value: '4'},
  {label: 'C轮', value: '5'},
  {label: 'D轮及以上', value: '6'},
  {label: '已经上市', value: '7'}
];

export const LENGTH_OF_MILITARY_DATA = [
  {label: '不限', value: ''},
  {label: '2年兵', value: '2'},
  {label: '5年兵', value: '5'},
  {label: '8年及以上', value: '8'}
];
export const EDUCATIONS_DATA = [
  {label: '不限', value: ''},
  {
    label: '初中及以下',
    value: '1'
  },
  {
    label: '中专/中技',
    value: '2'
  },
  {
    label: '高中',
    value: '3'
  },
  {
    label: '大专',
    value: '4'
  },
  {
    label: '本科',
    value: '5'
  },
  {
    label: '硕士',
    value: '6'
  },
  {
    label: '博士',
    value: '7'
  }
];
export const SALARIES_DATA = (function () {
  const arr = [];
  arr.push({
    name: '面议',
    code: '0',
    sub: [
      {
        name: '面议',
        code: '0',
      }
    ]
  });
  for (let i = 1; i <= 50; i++) {
    const obj = {};
    obj['name'] = i.toString();
    obj['code'] = i.toString();
    const sub = [];
    for (let j = i + 1; j <= i * 2; j++) {
      const subObj = {};
      subObj['name'] = j.toString();
      subObj['code'] = j.toString();
      sub.push(subObj);
    }
    obj['sub'] = sub;
    arr.push(obj);
  }

  for (let i = 60; i <= 250; i = i + 10) {
    const obj = {};
    obj['name'] = i.toString();
    obj['code'] = i.toString();
    const sub = [];
    for (let j = i + 10; j <= i * 2 && j <= 260; j = j + 10) {
      const subObj = {};
      subObj['name'] = j.toString();
      subObj['code'] = j.toString();
      sub.push(subObj);
    }
    obj['sub'] = sub;
    arr.push(obj);
  }
  return arr;
})();

export const SERVICES_DATA = [
  {
    'name': '不限',
    'code': '100000',
    'sub': [
      {
        'name': '不限',
        'code': '100100',
      }
    ]
  },
  {
    'name': '陆军',
    'code': '110000',
    'sub': [
      {
        'name': '步兵',
        'code': '110100',
      },
      {
        'name': '侦察兵',
        'code': '110200',
      },
      {
        'name': '装甲兵',
        'code': '110300',
      },
      {
        'name': '炮兵',
        'code': '110400',
      },
      {
        'name': '防空兵',
        'code': '110500',
      },
      {
        'name': '陆军航空兵',
        'code': '110600',
      },
      {
        'name': '工程兵',
        'code': '110700',
      },
      {
        'name': '通信兵',
        'code': '110800',
      },
      {
        'name': '防化兵',
        'code': '110900',
      },
      {
        'name': '电子对抗兵',
        'code': '111000',
      },
      {
        'name': '特种兵',
        'code': '111100',
      }
    ]
  },
  {
    'name': '海军',
    'code': '120000',
    'sub': [
      {
        'name': '水面舰艇部队',
        'code': '120100',
      },
      {
        'name': '潜艇部队',
        'code': '120200',
      },
      {
        'name': '海军航空兵',
        'code': '120300',
      },
      {
        'name': '海军岸防部队',
        'code': '120400',
      },
      {
        'name': '海军陆战队',
        'code': '120500',
      }
    ]
  },
  {
    'name': '空军',
    'code': '130000',
    'sub': [
      {
        'name': '空军航空兵',
        'code': '130100',
      },
      {
        'name': '地空导弹兵',
        'code': '130200',
      },
      {
        'name': '高射炮兵',
        'code': '130300',
      },
      {
        'name': '雷达兵',
        'code': '130400',
      },
      {
        'name': '电子对抗兵',
        'code': '130500',
      },
      {
        'name': '空降兵',
        'code': '130600',
      }
    ]
  },
  {
    'name': '火箭军',
    'code': '140000',
    'sub': [
      {
        'name': '导弹兵',
        'code': '140100',
      },
      {
        'name': '其它保障部队',
        'code': '140200',
      }
    ]
  },
  {
    'name': '战略支援部队',
    'code': '150000',
    'sub': [
      {
        'name': '网络部队',
        'code': '150100',
      },
      {
        'name': '航天部队',
        'code': '150200',
      },
      {
        'name': '保障部队',
        'code': '150300',
      }
    ]
  },
  {
    'name': '武装警察',
    'code': '160000',
    'sub': [
      {
        'name': '内卫部队',
        'code': '160100',
      },
      {
        'name': '警卫部队',
        'code': '160200',
      },
      {
        'name': '边防部队',
        'code': '160300',
      },
      {
        'name': '消防部队',
        'code': '160400',
      },
      {
        'name': '黄金部队',
        'code': '160500',
      },
      {
        'name': '水电部队',
        'code': '160600',
      },
      {
        'name': '交通部队',
        'code': '160700',
      },
      {
        'name': '森林部队',
        'code': '160800',
      }
    ]
  }
];

export const EVALUATE_DATA = {
  pass: [
    {
      label: '态度好',
      value: '1'
    },
    {
      label: '准时',
      value: '2'
    },
    {
      label: '经验丰富',
      value: '3'
    },
    {
      label: '技能扎实',
      value: '4'
    }
  ],
  reject: [
    {
      label: '态度差',
      value: '1'
    },
    {
      label: '不准时',
      value: '2'
    },
    {
      label: '经验不足',
      value: '3'
    },
    {
      label: '职能不符',
      value: '4'
    },
    {
      label: '不真实',
      value: '5'
    },
    {
      label: '薪资不合',
      value: '6'
    },
    {
      label: '有更好人选',
      value: '7'
    }
  ],
  undetermined: [
    {
      label: '考虑中',
      value: '1'
    },
    {
      label: '尚有人选',
      value: '2'
    },
    {
      label: '需要二面',
      value: '3'
    },
    {
      label: '经验不足',
      value: '4'
    },
    {
      label: '薪资不合',
      value: '5'
    },
    {
      label: '不够专业',
      value: '6'
    }
  ],
  forgot: []
};

