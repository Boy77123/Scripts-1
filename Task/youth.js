/*
更新时间: 2020-09-10 23:15

赞赏:中青邀请码`46308484`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于中青看点极速版领取青豆

增加每日打卡，打卡时间每日5:00-8:00❗️，请不要忘记设置运行时间，共3条Cookie，请全部获取，获取请注释掉

获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.进入app，进入任务中心或者签到一次,即可获取Cookie. 阅读一篇文章，获取阅读请求body，并获取阅读时长，在阅读文章最下面有个惊喜红包，点击获取惊喜红包请求
3.可随时获取Cookie.
4.增加转盘抽奖通知间隔，为了照顾新用户，前三次会有通知，以后默认每10次转盘抽奖通知一次，可自行修改❗️ 转盘完成后通知会一直开启
5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
6.更新日志: 
 31/05 v1.01 取消激励视频Cookie，添加阅读时长

阅读奖励和看视频得奖励一个请求只能运行三次‼️，请不要询问为什么，次日可以继续


仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
中青看点 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,script-update-interval=0

中青看点 = type=http-request,pattern=https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign),script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/complete,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/red_packet,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, enabled=true, tag=中青看点

http-request https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/article\/red_packet script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
-----------------
QX 1.0. 7+ :
[task_local]
0 9 * * * youth.js

[rewrite_local]
https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) url script-request-header youth.js

https?:\/\/ios\.baertt\.com\/v5\/article\/complete url script-request-body youth.js

https:\/\/ios\.baertt\.com\/v5\/article\/red_packet url script-request-body youth.js

https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json url script-request-body youth.js


~~~~~~~~~~~~~~~~
[MITM]
hostname = *.youth.cn, ios.baertt.com 
~~~~~~~~~~~~~~~~

*/
const setnotify = 50  //通知间隔，默认抽奖每50次通知一次，如需关闭全部通知请设为0
//let resplogs = false;   //调试日志开关为false或true
let s = 300
const $ = new Env("中青看点")
let notifyInterval = $.getdata("notifytimes")||setnotify
const logs = $.getdata('zqlogs')||resplogs
const signheaderVal = $.getdata('youthheader_zq')
const redpbodyVal = $.getdata( 'red_zq')
const articlebodyVal = $.getdata('read_zq')
const timebodyVal = $.getdata('readtime_zq')
let   opboxtime = $.getdata('opbox')
const checktimes = $.getdata('signt')||0


let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
 !(async () => {
    if (!signheaderVal) {
        return $.msg($.name, `请先获取Cookie`, ``)
    }
  await sign();
  await signInfo();
if(!logs||!logs=='false'){
 $.log("\n开始每日任务 ⛳️");
}
  await Invitant();
if($.time('HH')>12){
  await punchCard()
}
if($.time('HH')<9&&$.time('HH')>4){
  await endCard();
  await Cardshare()
}
if(checktimes&&checktimes<5){
  await openbox();
  await boxshare();
}
  await getAdVideo();
  await gameVideo();
  await readArticle();
  await Articlered();
  await readTime();
  await rotary();
  await rotaryCheck();
  await earningsInfo();
  await showmsg()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}

function GetCookie() {
   if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/TaskCenter\/(sign|getSign)/)) {
   const signheaderVal = JSON.stringify($request.headers)
    if (signheaderVal)        $.setdata(signheaderVal,'youthheader_zq')
    $.log(`${$.name} 获取Cookie: 成功,signheaderVal: ${signheaderVal}`)
    $.msg($.name, `获取Cookie: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/article\/complete/)) {
   const articlebodyVal = $request.body
    if (articlebodyVal)        $.setdata(articlebodyVal,'read_zq')
    $.log(`${$.name} 获取阅读: 成功,articlebodyVal: ${articlebodyVal}`)
    $.msg($.name, `获取阅读请求: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/v5\/user\/app_stay/)) {
   const timebodyVal = $request.body
    if (timebodyVal)        $.setdata(timebodyVal,'readtime_zq')
    $.log(`${$.name} 获取阅读: 成功,timebodyVal: ${timebodyVal}`)
    $.msg($.name, `获取阅读时长: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/article\/red_packet/)) {
   const redpbodyVal = $request.body
    if (redpbodyVal)        $.setdata(redpbodyVal, 'red_zq')
    $.log(`${$.name} 获取惊喜红包: 成功,redpbodyVal: ${redpbodyVal}`)
    $.msg($.name, `获取惊喜红包请求: 成功🎉`, ``)
  }
 }

function sign() {
    return new Promise((resolve, reject) => {
        const signurl = {
            url: 'https://kd.youth.cn/TaskCenter/sign',
            headers: JSON.parse(signheaderVal),
        }
        $.post(signurl, (error, response, data) => {
            if(!logs||!logs=="false") $.log(`开始签到`)
            signres = JSON.parse(data)
            if (signres.status == 2) {
                signresult = `签到失败，Cookie已失效‼️`;
                $.msg($.name, signresult, "");
                return

            } else if (signres.status == 0) {
                signresult = `【签到结果】重复`;
                detail = ""
                if(!checktimes){
                 //setdata(Number(checktimes)+1,'signt')
               }
            }else if (signres.status == 1) {
                detail = `【签到结果】金币: +${signres.score}，明日金币: +${signres.nextScore}\n`
               //setdata(checktimes+1,'signt')
            }
            resolve() 
        })
    })
}
      
function signInfo() {
    return new Promise((resolve, reject) => {
        const infourl = {
            url: 'https://kd.youth.cn/TaskCenter/getSign',
            headers: JSON.parse(signheaderVal),
        }
        $.post(infourl, (error, response, data) => {
          //if(!logs||!logs=="false")$.log(`签到信息: data`);
            signinfo = JSON.parse(data);
            if (signinfo.status == 1) {
                subTitle = `【收益总计】${signinfo.data.user.score}青豆  现金约${signinfo.data.user.money}元`;
                nick = `账号: ${signinfo.data.user.nickname}`;
                detail = `${signresult}(+${signinfo.data.sign_score}青豆) 已连签: ${signinfo.data.sign_day}天\n<本次收益>：\n`;
            } else {
                subTitle = `${signinfo.msg}`;
                detail = ``;
            }
            resolve()
        })
    })
}

//开启打卡
function punchCard() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://kd.youth.cn/WebApi/PunchCard/signUp?`,
            headers: JSON.parse(signheaderVal),
        }
        $.post(url, (error, response, data) => {
            if(!logs||!logs=="false") $.log(`每日开启打卡`);
            punchcardstart = JSON.parse(data);
            if (punchcardstart.code == 1) {
                detail += `【打卡报名】打卡报名${punchcardstart.msg} ✅ \n`;
                if(!logs||!logs == "false")$.log("每日报名打卡成功，报名时间:"+`${$.time('MM-dd HH:mm')}`)
                resolve();
            }
          else {
            //detail += `【打卡报名】${punchcardstart.msg}\n`
            if(!logs||!logs == "false")$.log(punchcardstart.msg)
            resolve()
          }
        })
    })
}

//结束打卡
function endCard() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const url = {
              url: `https://kd.youth.cn/WebApi/PunchCard/doCard?`,headers: JSON.parse(signheaderVal),
            }
            $.post(url, (error, response, data) => {
                if(!logs||!logs=="false")$.log(`早起开始打卡`)
                punchcardend = JSON.parse(data)
                if (punchcardend.code == 1) {
                    detail += `【早起打卡】${punchcardend.data.card_time}${punchcardend.msg}✅\n`
                  if(!logs||!logs == "false") $.log("早起打卡成功，打卡时间:"+`${punchcardend.data.card_time}`)
                } else if (punchcardend.code == 0) {
                    // TODO .不在打卡时间范围内
                    //detail += `【早起打卡】${punchcardend.msg}\n`
                  if(!logs||!logs == "false") $.log("不在打卡时间范围内")
                }
                resolve()
            })
        },s)
    })
}


//打卡分享
function Cardshare() {
    return new Promise((resolve, reject) => {
        const starturl = {
            url: `https://kd.youth.cn/WebApi/PunchCard/shareStart?`,
            headers: JSON.parse(signheaderVal),
        }
        $.post(starturl, (error, response, data) => {
         if(!logs||!logs=="false") $.log(`开始分享打卡任务`)
            sharestart = JSON.parse(data)
            //detail += `【打卡分享】${sharestart.msg}\n`
            if (sharestart.code == 1) {
                setTimeout(() => {
                    let endurl = {
                        url: `https://kd.youth.cn/WebApi/PunchCard/shareEnd?`,
                        headers: JSON.parse(signheaderVal)
                    }
                    $.post(endurl, (error, response, data) => {
                        shareres = JSON.parse(data)
                        if (shareres.code == 1) {
                            detail += `+${shareres.data.score}青豆\n`
                        if(!logs||!logs == "false") $.log(`【打卡分享】成功，获得`+shareres.data.score+"个青豆")
                        } else {
                            //detail += `【打卡分享】${shareres.msg}\n`
                         if(!logs||!logs == "false") $.log(`${shareres.msg}`)
                        }
                        resolve()
                    })
                  },s*2);
            }else{
                resolve()
            }
        })
    })
}

//开启时段宝箱
function openbox() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const url = {
                url: `https://kd.youth.cn/WebApi/invite/openHourRed`,
                headers: JSON.parse(signheaderVal),
            }
            $.post(url, (error, response, data) => {
                if(!logs||!logs=="false") $.log(`开启时段宝箱任务`)
                boxres = JSON.parse(data)
                if (boxres.code == 1) {
                  boxretime = boxres.data.time
                  setdata(boxretime, 'opbox')
                    detail += `【开启宝箱】+${boxres.data.score}青豆 下次奖励${boxres.data.time / 60}分钟\n`
      
                    if(!logs||!logs=="false") $.log(`开启时段宝箱成功，获得`+boxres.data.score+`个青豆，${boxres.data.time / 60}`+"后开启下一个宝箱")
                }else{
                    //detail += `【开启宝箱】${boxres.msg}\n`
                    if(!logs||!logs == "false") $.log(`${boxres.msg}`)
                }
                resolve()
            })
        },s)
    })
}

//宝箱分享
function boxshare() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const url = {
                url: `https://kd.youth.cn/WebApi/invite/shareEnd`,
                headers: JSON.parse(signheaderVal),
            }
            $.post(url, (error, response, data) => {
                if(!logs||!logs=="false") $.log(`开始分享宝箱任务`)
                shareres = JSON.parse(data)
                if (shareres.code == 1) {
                    detail += `【宝箱分享】+${shareres.data.score}青豆\n`
                  if(!logs||!logs == "false") $.log(`分享宝箱任务成功，获得${shareres.data.score}青豆`)
                }else{
                    //detail += `【宝箱分享】${shareres.msg}\n`
                  if(!logs||!logs == "false") $.log(`${shareres.msg}`)
                }
                resolve()
            })
        },s*2);
    })
}

function Invitant() {      
 return new Promise((resolve, reject) => {
   const url = { 
     url: `https://kd.youth.cn/WebApi/User/fillCode`, 
     headers: JSON.parse(signheaderVal),
     body: `{"code": "46308484"}`,
}
   $.post(url, (error, response, data) =>
 {
   //if(!logs||!logs == "false") $.log(`Invitdata:${data}`)
 })
  aticleshare()
  resolve()
 })
}

function aticleshare() {
    return new Promise((resolve, reject) => {
        const rand = Math.random().toFixed(3).toString().substr(2).replace("0", "7");
        shareurl = {
            url: `https://kd.youth.cn/n/27043${rand}?46746961.html`,
            headers: { Cookie: JSON.parse(signheaderVal)['Cookie'] },
        }
        $.get(shareurl, (error, response, data) => {
            // if(!logs||!logs == "false") $.log(`aticleshare:${data}`);
            resolve();
        })
    })
}

//看视频奖励
function getAdVideo() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://kd.youth.cn/taskCenter/getAdVideoReward`,
            headers: JSON.parse(signheaderVal),
            body: 'type=taskCenter'
        }
        $.post(url, (error, response, data) => {
            if(!logs||!logs == "false") $.log(`观看视频广告`)
            adVideores = JSON.parse(data)
            if (adVideores.status == 1) {
                detail += `【观看视频】+${adVideores.score}个青豆\n`
                if(!logs||!logs == "false") $.log("获得"+adVideores.score+"个青豆")
            }
            resolve()
        })
    })
}
// 激励视频奖励
function gameVideo() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://ios.baertt.com/v5/Game/GameVideoReward.json`,
            body: articlebodyVal,
        }
        $.post(url, (error, response, data) => {
             if(!logs||!logs == "false") $.log(`观看激励视频`)
            gameres = JSON.parse(data)
            if (gameres.success == true) {
                detail += `【激励视频】${gameres.items.score}\n`
               if(!logs||!logs == "false") $.log("获得"+gameres.items.score)
            }else{
                if(gameres.error_code == "10003"){
                    //detail += `【激励视频】${gameres.message},疑似cookie没有\n`
                }
            }
            resolve()
        })
    })
}


//阅读奖励
function readArticle() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://ios.baertt.com/v5/article/complete.json`,
            body: articlebodyVal,
        }
        $.post(url, (error, response, data) => {
            if(!logs||!logs == "false") $.log(`开始阅读文章`)
            readres = JSON.parse(data);
            if (readres.items.max_notice == '\u770b\u592a\u4e45\u4e86\uff0c\u63621\u7bc7\u8bd5\u8bd5') {
              //detail += `【阅读奖励】看太久了，换1篇试试\n`;
           if(!logs||!logs == "false") $.log(readres.items.max_notice)
            }else if (readres.items.read_score !== undefined) {
              detail += `【阅读奖励】+${readres.items.read_score}个青豆\n`;
              if(!logs||!logs == "false") $.log("本次阅读获得"+readres.items.read_score+"个青豆")
            }
            resolve()
        })
    })
}
//惊喜红包
function Articlered() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://ios.baertt.com/v5/article/red_packet.json`,
            body: redpbodyVal,
        }
        $.post(url, (error, response, data) => {
            if(!logs||!logs == "false") $.log(`打开惊喜红包`)
            redres = JSON.parse(data)
            if (redres.success == true) {
                detail += `【惊喜红包】+${redres.items.score}个青豆\n`
              if(!logs||!logs == "false") $.log("惊喜红包获得"+redres.items.score+"个青豆")
            }else{
                if(redres.error_code == "100001"){
                    //detail += `【惊喜红包】${redres.message},疑似cookie没有\n`
                 if(!logs||!logs == "false") $.log("每日开启惊喜红包已超限")
                }
            }
            resolve()
        })
    })
}
//转盘任务
function rotary() {
   const rotarbody = signheaderVal.split("&")[15] + '&' + signheaderVal.split("&")[8]
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const time = new Date().getTime()
            const url = {
                url: `https://kd.youth.cn/WebApi/RotaryTable/turnRotary?_=${time}`,
                headers: JSON.parse(signheaderVal),
                body: rotarbody
            }
            $.post(url, (error, response, data) => {
               if(!logs||!logs == "false") $.log(`开始转盘任务`)
                rotaryres = JSON.parse(data)
                if (rotaryres.status == 1) {
                    detail += `【转盘抽奖】+${rotaryres.data.score}个青豆 剩余${rotaryres.data.remainTurn}次\n`
                    if(!logs||!logs == "false") $.log("转盘抽奖获得"+rotaryres.data.score+"个青豆，转盘次数还有"+rotaryres.data.remainTurn+"次")
                }
                if (rotaryres.code == 10010) {
                    rotarynum = ` 转盘${rotaryres.msg}🎉`
                if(!logs||!logs == "false") $.log("转盘任务已全部完成")
                }else{
                    if (rotaryres.data.doubleNum != 0) {
                        TurnDouble()
                    }
                }
                resolve();
            })
        }, s);
    })
}

//转盘宝箱判断
function rotaryCheck() {
    return new Promise(async resolve => {
        if (rotaryres.code == 10010) {
            return resolve();
        }
        let i = 0;
        while (i <= 3) {
            if (100 - rotaryres.data.remainTurn == rotaryres.data.chestOpen[i].times) {
                await runRotary(i + 1)
            }
            i++;
        }
        resolve();
    })
}

//开启宝箱
function runRotary(index) {
    return new Promise((resolve, reject) => {
        const rotarbody = signheaderVal.split("&")[15] + '&' + signheaderVal.split("&")[8] + '&num=' + index;
        const time = new Date().getTime();
        const url = {
            url: `https://kd.youth.cn/WebApi/RotaryTable/chestReward?_=${time}`,
            headers: JSON.parse(signheaderVal),
            body: rotarbody
        }
        $.post(url, (error, response, data) => {
            if(!logs||!logs == "false") $.log(`转盘宝箱${index}抽奖`)
            const rotaryresp = JSON.parse(data);
            if (rotaryresp.status == 1) {
                detail += `【转盘宝箱${index}】+${rotaryresp.data.score}个青豆\n`;
             if(!logs||!logs == "false") $.log("开启宝箱"+index+"，获得"+rotaryresp.data.score+"个青豆")
            }else{
                if(rotaryresp.code == "10010"){
                    detail += `【转盘宝箱${index}】+今日抽奖完成\n`;
                  if(!logs||!logs == "false") $.log("转盘宝箱已全部开启")
                }
            }
            resolve();
        })
    })
}

//转盘双倍奖励
function TurnDouble() {
    const rotarbody = signheaderVal.split("&")[15] + '&' + signheaderVal.split("&")[8]
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const time = (new Date()).getTime()
            const url = {
                url: `https://kd.youth.cn/WebApi/RotaryTable/toTurnDouble?_=${time}`,
                headers: JSON.parse(signheaderVal),
                body: rotarbody
            }
            $.post(url, (error, response, data) => {
                if(!logs||!logs == "false") $.log(`开始转盘双倍奖励`)
                Doubleres = JSON.parse(data)
                if (Doubleres.status == 1) {
                    detail += `【转盘双倍】+${Doubleres.data.score1}青豆 剩余${rotaryres.data.doubleNum}次\n`
                 if(!logs||!logs == "false") $.log(`转盘双倍奖励成功，获得${Doubleres.data.score1}青豆`)
                }else{
                    //detail += `【转盘双倍】失败 ${Doubleres.msg}\n`
                 if(!logs||!logs == "false") $.log(`转盘双倍奖励失败，原因:${Doubleres.msg}`)
                }
                resolve()
            })
        },s)
    })
}

function readTime() {
    return new Promise((resolve, reject) => {
        const url = {
            url: `https://ios.baertt.com/v5/user/stay.json`,body: timebodyVal }
        $.post(url, (error, response, data) => {
            if(!logs||!logs == "false") $.log(`开始统计阅读时长`)
            let timeres = JSON.parse(data)
            if (timeres.error_code == 0) {
                readtimes = timeres.time / 60
                detail += `【阅读时长】共计` + Math.floor(readtimes) + `分钟\n`
                if(!logs||!logs == "false") $.log(`共计阅读`+Math.floor(readtimes)+"分钟")
            } else {
                if (timeres.error_code == 200001) {
                    detail += `【阅读时长】❎ 未获取阅读时长Cookie\n`
                }else{
                    detail += `【阅读时长】❎ ${timeres.msg}\n`
                if(!logs||!logs == "false") $.log(`阅读时长统计失败，原因:${timeres.msg}`)
                }
            }
            resolve()
        })
    })
}

function earningsInfo() {
    return new Promise((resolve, reject) => {
        const token = JSON.parse(signheaderVal)['Referer'].split("?")[1]
        setTimeout(() => {
            const url = {
                url: `https://kd.youth.cn/wap/user/balance?${token}`,
                headers: signheaderVal,
            }
            $.get(url, (error, response, data) => {
             if(!logs||!logs == "false") $.log(`开始统计收益信息`)
                infores = JSON.parse(data)
                if (infores.status == 0) {
                    detail += `<收益统计>：\n`
                    for (i = 0; i < infores.history[0].group.length; i++) {
                        detail += '【' + infores.history[0].group[i].name + '】' + infores.history[0].group[i].money + '个青豆\n'
                    }
                    detail += '<今日合计>： ' + infores.history[0].score + " 青豆"
                 if(!logs||!logs == "false") $.log('<今日合计>： ' + infores.history[0].score + " 青豆")
                }
                resolve()
            })
        },s)
    })
}
function showmsg() {
    return new Promise(resolve => {
        if (rotaryres.status == 1 && rotaryres.data.remainTurn >= 97) {
            $.msg($.name + " " + nick, subTitle, detail)  //默认前三次为通知
        }else if (rotaryres.status == 1 && rotaryres.data.remainTurn % notifyInterval == 0) {
            $.msg($.name + " " + nick, subTitle, detail) //转盘次数/间隔整除时通知
        }else if (rotaryres.code == 10010 && notifyInterval != 0) {
            rotarynum = ` 转盘${rotaryres.msg}🎉`
   $.msg($.name+"  "+nick+" "+rotarynum,subTitle,detail)//任务全部完成且通知间隔不为0时通知
        }
        resolve()
    })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
