import type { Scene } from '../types';

const scene: Scene = {
  id: 'family-dinner',
  title: '年夜饭·七大姑八大姨',
  emoji: '🧨',
  description: '年夜饭连环灵魂拷问，招架不住当场社死',
  bgImage: new URL('../../assets/bg-family-dinner.svg', import.meta.url).href,
  bgColor: 'from-red-500/80 via-orange-400/60 to-amber-500/70',
  accentColor: 'red',
  characters: [
    { name: '大姑', emoji: '👵', description: '全年在线催婚催生主力选手' },
    { name: '表姐', emoji: '👱‍♀️', description: '常年用来对比的"别人家孩子"' },
    { name: '二叔', emoji: '🧔', description: '最爱刨根问底打探收入存款' },
  ],
  questions: [
    {
      id: 'family-dinner-q1',
      triggerDialog: '小X啊，你看你表姐都生二胎儿女双全了，你咋还迟迟不找对象呢？来来来大姑敬你一杯，祝你明年火速脱单，赶紧把这杯干了！',
      options: [
        { id: 'family-q1-low',    level: 'low',    content: '大姑，我的私事用不着您操心，我又不是没人要。', score: 20 },
        { id: 'family-q1-medium', level: 'medium', content: '哈哈大姑，缘分这东西急不来，顺其自然慢慢碰呗~', score: 55 },
        { id: 'family-q1-high',   level: 'high',   content: '大姑这杯我仰头干了！找对象我也想啊，择偶标准都照着姑父踏实靠谱的模板找，您以后碰到合适的记得帮我牵线把关！', score: 80 },
        { id: 'family-q1-god',    level: 'god',    content: '大姑谢谢您这么惦记我！这杯酒我必须喝。我现在单身攒钱自由，逢年过节还能给您买补品送礼物，真等谈恋爱结婚花钱，往后可没多余零花钱孝敬您咯！', score: 95 },
        { id: 'family-q1-anti',   level: 'anti',   content: '大姑您说得太对，表姐人生赢家太厉害了！咱别光盯着我单身，您咋不问问表姐夫年终奖到手多少钱，零花钱够不够表姐花？二叔，您家儿子今年考研上岸没？', score: 100 },
      ],
    },
    {
      id: 'family-dinner-q2',
      triggerDialog: '小X啊，你今年工资涨了没？隔壁王阿姨家儿子年薪上百万，你也跟大伙说说收入，让亲戚们跟着沾沾喜气呗？',
      options: [
        { id: 'family-q2-low',    level: 'low',    content: '工资是我隐私，又不是您发薪水，没必要到处往外说。', score: 20 },
        { id: 'family-q2-medium', level: 'medium', content: '收入凑合够养活自己，平平淡淡，没啥值得显摆的。', score: 55 },
        { id: 'family-q2-high',   level: 'high',   content: '大姑您放心，老板已经许诺明年给我调薪，等涨工资第一时间给您包个大红包孝敬您！', score: 80 },
        { id: 'family-q2-god',    level: 'god',    content: '大姑您这个问题太难回答了！比上不足比下有余，跟姑父积蓄比我差老远，跟王阿姨家百万年薪更是没法比。不如聊聊表姐夫今年过年给您包了多少红包？', score: 95 },
        { id: 'family-q2-anti',   level: 'anti',   content: '好家伙大姑，您是打算主动给我补发压岁钱补贴生活费？年薪百万那位是隔壁王阿姨儿子，您想打听收入直接去找他唠！顺带问问您退休金今年涨多少？二叔欠您那三万块还清了吗？', score: 100 },
      ],
    },
    {
      id: 'family-dinner-q3',
      triggerDialog: '你看身边同龄人都买房买车安家了，你咋还租房住呢？攒钱啥时候是个头，早点买房成家才安稳啊！',
      options: [
        { id: 'family-q3-low',    level: 'low',    content: '买房压力太大买不起，别总拿买房说事念叨我了。', score: 21 },
        { id: 'family-q3-medium', level: 'medium', content: '慢慢来规划存钱呢，攒够首付预算就着手看房。', score: 54 },
        { id: 'family-q3-high',   level: 'high',   content: '大姑说得在理，买房我一直在规划盘算，您经验丰富，以后我看房拿不定主意，还得来请教您帮我参考避坑！', score: 81 },
        { id: 'family-q3-god',    level: 'god',    content: '我也琢磨着置办房产呢，奈何房价压力不小。大姑您人脉广路子多，要是手里有性价比高的房源，麻烦帮我留意推荐一套，首付缺口还差不少，您方便搭把手周转一点不？', score: 96 },
        { id: 'family-q3-anti',   level: 'anti',   content: '买房我做梦都想！要不大姑您先赞助我一半首付，我立马看房定房落户，房产证还能加上您名字；对了二叔您房贷还有几年还清，每月还贷压力大不大？', score: 100 },
      ],
    },
  ],
};

export default scene;
