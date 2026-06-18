import type { Scene } from '../types';

const scene: Scene = {
  id: 'workplace',
  title: '职场·老板的送命题',
  emoji: '💼',
  description: '周五下班夺命提问，句句都是职场生死选择题',
  bgImage: new URL('../../assets/bg-office.svg', import.meta.url).href,
  bgColor: 'from-orange-500/80 via-amber-400/60 to-yellow-500/70',
  accentColor: 'orange',
  characters: [
    { name: '王总', emoji: '🤵', description: '擅长画饼、笑里藏刀的阴阳怪气型领导' },
    { name: '李经理', emoji: '👨‍💼', description: '在一旁吃瓜看戏的中层同事' },
  ],
  questions: [
    {
      id: 'workplace-q1',
      triggerDialog: '小X啊，这个方案周一就要交付，你看看周末能不能抽空加个班赶出来？放心哈，也不着急，你自己看着灵活安排就行。',
      options: [
        { id: 'wp-q1-low',    level: 'low',    content: '周末我早就安排私事了，而且这个工作量根本不是一个周末能做完的。', score: 15 },
        { id: 'wp-q1-medium', level: 'medium', content: '好的王总，我尽量压缩个人时间，周末加班赶出来交付。', score: 50 },
        { id: 'wp-q1-high',   level: 'high',   content: '王总周末我可以推进方案！不过有几个核心细节我想提前跟您对齐，避免反复修改返工，您看明天抽空方便通几分钟电话吗？', score: 82 },
        { id: 'wp-q1-god',    level: 'god',    content: '王总您放心交付交给我！想要方案惊艳客户一稿过，我需要李经理手里一部分业务数据支撑，麻烦您帮忙协调对接一下，我周末全速推进落地。', score: 96 },
        { id: 'wp-q1-anti',   level: 'anti',   content: '加班没问题王总！先说清楚，劳动法规定周末加班双倍薪资，您看是事后给我折算现金加班费，还是后续申请调休抵扣？顺带问问您上周我提交的差旅费报销啥时候审批到账？', score: 100 },
      ],
    },
    {
      id: 'workplace-q2',
      triggerDialog: '小X，你客观聊聊，咱们团队里谁最需要优化淘汰？大胆说实话，我就私下问问，绝对不会外传是你说的。',
      options: [
        { id: 'wp-q2-low',    level: 'low',    content: '我感觉XXX平时摸鱼混日子最严重，您可以重点考察这个人。', score: 20 },
        { id: 'wp-q2-medium', level: 'medium', content: '王总，团队每个人各司其职都挺好的，暂时没有觉得谁不合适。', score: 55 },
        { id: 'wp-q2-high',   level: 'high',   content: '王总您这个问题属实把我难住了，每位同事都有自己擅长的领域，与其优化人员，不如梳理优化重复低效的工作流程，整体效率提升更实在。', score: 80 },
        { id: 'wp-q2-god',    level: 'god',    content: '王总扪心自问，我觉得现阶段最该打磨优化的人是我自己！近期感觉个人成长速度变慢，您能不能指点我短板在哪，或者推荐一些提升能力的书籍方向？', score: 95 },
        { id: 'wp-q2-anti',   level: 'anti',   content: '王总您这纯纯钓鱼执法套路啊！说真话打小报告的人往往第一个被优化，您心里早就想好要裁谁直接明说，需要我帮忙当众传话安抚其他同事不？', score: 100 },
      ],
    },
    {
      id: 'workplace-q3',
      triggerDialog: '这次项目搞砸出纰漏了，部门上下都有责任，你分析下问题根源，说说主要是谁的问题？',
      options: [
        { id: 'wp-q3-low',    level: 'low',    content: '这事主要是对接环节李经理给的数据出错，才导致项目翻车。', score: 18 },
        { id: 'wp-q3-medium', level: 'medium', content: '多方环节都有疏漏，大家都有考虑不周的地方，没法单归责某一个人。', score: 52 },
        { id: 'wp-q3-high',   level: 'high',   content: '王总我复盘梳理过了，前期沟通衔接出现信息差是核心问题，我整理一份整改方案，后续规避同类问题再次出错，责任我该承担的部分绝不推诿。', score: 84 },
        { id: 'wp-q3-god',    level: 'god',    content: '整体失误我有不可推卸的执行责任，我先主动认领自己的问题，连夜出复盘整改方案。后续我们开短会全员梳理漏洞，定好权责划分，杜绝下次踩同款坑。', score: 97 },
        { id: 'wp-q3-anti',   level: 'anti',   content: '要论根源追到底，最开始拍板定方案的是您王总，中途改需求来回折腾也是临时通知；要不咱开全员大会，挨个逐层往上溯源追责，把前因后果全摊开讨论？', score: 100 },
      ],
    },
  ],
};

export default scene;
