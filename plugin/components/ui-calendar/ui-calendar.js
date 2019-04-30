// plugin/components/ui-calendar/ui-calendar.js
const { formatNumber, getMulArray } = require('./util.js')


// 

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: String,
      value: '' 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    week: ['一', '二', '三', '四', '五', '六', '日'], // 周
    day: [], // 日期
    current: 0, // 当前滑块
    index: 0, // 当前索引
    topDate: '', // 显示年月
  },

  lifetimes: {
    attached() {
      this.init()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 初始化日历 */
    init(date, callback) {
      let dateAll = this.initDate(date)
      let day = getMulArray(dateAll)
      let current = this.data.current
      console.log('当前滑块', current)
      console.log(dateAll)
      console.log(`当天日期：`, this.data.curDay)

      this.setData({
        day,
        ddy: this.data.curDay.ddy
      })

      let curDay = this.data.curDay
      let yy = curDay.date.split('/')[0]
      let mm = curDay.date.split('/')[1]
      let topDate = `${yy}年${mm}月`
      let index = this.getWeekDay(curDay.ddy)
      console.log(index)

      this.setData({
        topDate,
        index
      })
      callback && callback(curDay, current, index)
      // console.log('当前日期', curDay)
    },

    /* 上一周,下一周点击切换 */
    tapSlide(e) {
      let type = e.target.dataset.type
      let current = type == 'prev' ? this.data.current - 1 : this.data.current + 1
      if (current <= 0 || current >= this.data.day.length) return
      this.setData({ current })
    },

    /**
     * 获取一周中的第几天
     */
    getWeekDay(ddy) {
      return ddy == 0 ? 6 : ddy - 1
    },

    changeDate(e) {
      let { current } = e.detail
      this.setData({
        current: current
      })
      this.initTopDate()
    },

    initTopDate() {
      let curDay = this.data.day[this.data.current][this.getWeekDay(this.data.ddy)]
      console.log(this.data.day, this.data.current, this.data.ddy)
      let yy = curDay.date.split('/')[0]
      let mm = curDay.date.split('/')[1]
      let topDate = `${yy}年${mm}月`

      this.setData({
        topDate
      })
    },

    // 滑块滑完触发
    finishSwiper(e) {
      /* let { current } = e.detail
      this.setData({
        current: current
      }) */
    },

    // 高亮当前日期
    setCurDdy(day, ddy, current) {
      let index = this.getWeekDay(ddy)
      day.forEach((ele) => {
        ele.forEach(eleInner => {
          eleInner.current = false
        })
      })

      day[current][index].current = true
      return day
    },

    // 选择天数
    selectDay(e) {
      let { day, current } = this.data
      let { ddy } = e.currentTarget.dataset
      let index = this.getWeekDay(ddy)
      let curDay = day[current][index]
      let yy = curDay.date.split('/')[0]
      let mm = curDay.date.split('/')[1]
      let topDate = `${yy}年${mm}月`
      day = this.setCurDdy(day, ddy, current)

      this.setData({
        day: [...day],
        curDay,
        topDate
      })

      console.log(`当前滑块`, current)
      console.log(`当前索引`, index)
      console.log('当前选择日期', curDay)

      var target = {
        curDay: curDay,
        current: current,
        index: index
      }
      this.triggerEvent('SelectEvent', target)
    },

    // 初始化日期
    initDate(date) {
      let start = new Date(this.getDate(8, 'W', date || ''))
      let end = new Date(this.getDate(-8, 'W', date || ''))
      let dateAll = this.getDay(start, end, date)

      // 补前空缺
      if (dateAll[0].ddy != 1) {
        let s = dateAll[0].ddy == 0 ? 6 : dateAll[0].ddy
        let a = 0
        for (let i = s; i > 0; i--) {
          a++
          let newDate = this.getDate(-a, 'D', dateAll[a - 1].date)
          let newDd = formatNumber(new Date(newDate).getDate())
          let newDdy = new Date(newDate).getDay()
          if (newDdy != 0) {
            dateAll.unshift({
              date: newDate,
              dd: newDd,
              ddy: newDdy,
              disabled: false,
              current: false,
            })
          }
        }
      }

      // 补后空缺
      if (dateAll[dateAll.length - 1].ddy != 0) {
        let s = dateAll[dateAll.length - 1].ddy == 0 ? 6 : 7 - dateAll[dateAll.length - 1].ddy
        let a = 0
        let arr = []
        for (let i = 0; i < s; i++) {
          a++
          let newDate = this.getDate(a, 'D', dateAll[dateAll.length - a].date)
          let newDd = formatNumber(new Date(newDate).getDate())
          let newDdy = new Date(newDate).getDay()

          dateAll.push({
            date: newDate,
            dd: newDd,
            ddy: newDdy,
            disabled: false,
            current: false,
          })
        }
      }

      return dateAll
    },

    /**
     * 获取时间
     */
    getTime(date) {
      let now = date ? new Date(date) : new Date()
      let yy = now.getFullYear()
      let mm = formatNumber(now.getMonth() + 1)
      let dd = formatNumber(now.getDate())
      let datestr = yy + '/' + mm + '/' + dd
      return datestr
    },

    /* 获取区间内的天数 */
    getDay(start, end, today) {
      let dayAll = []
      let i = 0
      let now = this.getTime(today)
      while ((end.getTime() - start.getTime()) >= 0) {
        let dd = formatNumber(start.getDate())
        let date = this.getTime(start)
        let ddy = start.getDay()
        let current = false

        dayAll[i] = {
          date: date, // 年月日
          dd: dd, // 日
          ddy: ddy, // 周几
          disabled: false, // 是否可选
          current: current, // 是否是当前日期
        }


        if (now == this.getTime(date)) {
          let currentDate = new Date(today)
          let ddy2 = currentDate.getDay()

          this.setData({
            curDay: dayAll[i]
          })

          // 当前高亮
          current = true
          this.setData({
            current: parseInt(i / 7),
            ddy: ddy2
          })

          dayAll[i] = {
            date: date, // 年月日
            dd: dd, // 日
            ddy: ddy, // 周几
            disabled: false, // 是否可选
            current: current, // 是否是当前日期
          }
        }

        start.setDate(start.getDate() + 1)
        i += 1
      }

      return dayAll
    },

    /**
     * 补0 
     */
    formatNumber(value) {
      return (value < 10 ? '0' : '') + value;
    },

    /**
     * 获取多少 天||月||年 后||前 的日期
     * @param {Number} n 数量
     * @param {String} timeUnit 类别
     * @param {String} curDate 指定时间
     */
    getDate(n, timeUnit, curDate) {
      let datastr
      curDate = curDate ? new Date(curDate) : new Date()

      if (timeUnit === 'D') {
        // 天
        curDate.setDate(curDate.getDate() + n)
      } else if (timeUnit === 'M') {
        // 月
        curDate.setMonth(curDate.getMonth() + n)
      } else if (timeUnit === 'Y') {
        // 年
        curDate.setFullYear(curDate.getFullYear() + n)
      } else if (timeUnit === 'W') {
        var oneweekdate = new Date(curDate - n * 7 * 24 * 3600 * 1000)
        datastr = this.getTime(oneweekdate)
        return datastr
      }
      datastr = this.getTime(curDate)
      return datastr
    },
  }
})
