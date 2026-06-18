import type { Scene } from '../types';

const scene: Scene = {
  id: 'business-dinner',
  title: '酒局·被迫营业',
  emoji: '🍻',
  description: '客户疯狂劝酒，项目命运全在一张嘴上',
  bgImage: new URL('../../assets/bg-dinner.svg', import.meta.url).href,
  bgColor: 'from-amber-600/80 via-orange-500/60 to-red-500/70',
  accentColor: 'amber',
  characters: [
    { name: '刘总', emoji: '👨', description: '酒量惊人、爱拿项目拿捏人的豪爽型客户' },
    { name: '张哥', emoji: '🧔', description: '坐旁边看热闹的直属领导' },
  ],
  questions: [
    {
      id: 'business-dinner-q1',
      triggerDialog: '小X！我听说你们年轻人都能喝！来，咱俩走一个！这杯喝了，后面那个项目的事儿好说！',
      options: [
        { id: 'bd-q1-low',    level: 'low',    content: '刘总不好意思，我不能喝酒，医生不让。', score: 25 },
        { id: 'bd-q1-medium', level: 'medium', content: '刘总我干了您随意！项目的事您放心！', score: 50 },
        { id: 'bd-q1-high',   level: 'high',   content: '刘总！跟您喝酒是我的荣幸！这杯我先干为敬！不过项目就算不喝酒，我也一定给您落地得漂漂亮亮，绝不糊弄您！', score: 85 },
        { id: 'bd-q1-god',    level: 'god',    content: '刘总这杯必须领情！实话说我酒量浅，喝晕了怕脑子不清醒耽误对接您的项目。我先干三杯表诚意，剩下的诚意我用后续交付质量补齐，您看行不行？', score: 98 },
        { id: 'bd-q1-anti',   level: 'anti',   content: '刘总酒我肯定喝！先问一嘴：您说的项目是已经盖章敲定那个，还是您随口画的大饼？对了张哥，您帮我作证，刘总这酒喝了要是项目黄了，回头报销医药费不？', score: 100 },
      ],
    },
    {
      id: 'business-dinner-q2',
      triggerDialog: '小X啊，你们公司最近好像挺多人离职的？不会是你们老板太抠门留不住人吧？哈哈我就是随口唠嗑，你别多想！',
      options: [
        { id: 'bd-q2-low',    level: 'low',    content: '确实，我们老板真的很抠，福利也差，走的人都有道理。', score: 20 },
        { id: 'bd-q2-medium', level: 'medium', content: '还好吧，各行各业人员来来去去，流动也挺正常的。', score: 55 },
        { id: 'bd-q2-high',   level: 'high',   content: '刘总您消息也太灵通了！确实有同事选择新发展，但留下来的都是看重长期合作的，就像我跟您合作这么舒心，说啥也舍不得跳槽跑路！', score: 82 },
        { id: 'bd-q2-god',    level: 'god',    content: '刘总这您都听说了！其实公司是在精简人员，把人力资源全部倾斜给您这种优质大客户。我敬您一杯，也特别感谢您愿意持续给我们合作机会！', score: 95 },
        { id: 'bd-q2-anti',   level: 'anti',   content: '刘总您这是打算挖我跳槽，还是暗中摸底打探我们公司底细？想挖人您直接开薪资报价，想调研我当场推老板微信您私聊！顺带一提我要是跳槽跑路，您手里项目交接麻烦，成本都得您承担哦！', score: 100 },
      ],
    },
    {
      id: 'business-dinner-q3',
      triggerDialog: '来小X，别光顾着小口抿！我三杯下肚面不改色，你酒量也练练，连着闷三杯，以后咱们合作更好办事！',
      options: [
        { id: 'bd-q3-low',    level: 'low',    content: '我真喝不了三杯，您别逼我了，再喝就要醉倒失态了。', score: 22 },
        { id: 'bd-q3-medium', level: 'medium', content: '那我慢慢喝，一杯一杯陪您尽兴，尽力跟上您节奏。', score: 53 },
        { id: 'bd-q3-high',   level: 'high',   content: '刘总酒量属实佩服！三杯我量力而为，前两杯我一口气干完，最后一杯我小口慢饮，稍后我多敬您两杯茶补礼数，您看可以不？', score: 83 },
        { id: 'bd-q3-god',    level: 'god',    content: '刘总气场太强我属实佩服！喝酒是表达敬重，不是拼酒量，我两杯白酒表忠心，剩下一杯换成浓茶，后续项目细节我头脑清醒才能给您捋得面面俱到，不让您踩坑吃亏。', score: 97 },
        { id: 'bd-q3-anti',   level: 'anti',   content: '三杯没问题！咱提前说好，喝吐了饭店打扫费您报销，喝进医院急诊医药费您兜底，要是我喝醉乱说话得罪其他客户，锅可不能甩我头上啊刘总！', score: 100 },
      ],
    },
  ],
};

export default scene;
