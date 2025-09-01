// 游戏数据模型
export interface Question {
  id: number;
  title: string;
  background: string;
  optionA: string;
  optionB: string;
  correctAnswer: 'A' | 'B';
  hasReward: boolean;
}

export interface GameQuestion {
  id: number;
  title: string;
  background: string;
  options: {
    text: string;
    isCorrect: boolean;
    originalOption: 'A' | 'B';
  }[];
  hasReward: boolean;
}

// 原始题目数据（A选项总是正确答案）
const rawQuestions: Question[] = [
  {
    id: 1,
    title: "朋友的分岔路",
    background: "我初中有个同学叫翔翔，我们是很好的朋友。那时候他有一个朋友跟我不是很对付，他是翔翔的同一栋楼的邻居。有的时候翔翔来找他玩就不能找我玩。但是我不喜欢这样，我挺自私的，我希望他能找我玩而不去找那个同学玩。",
    optionA: "…但是我不表现出来。我会说：'好吧，你去吧。'或者'都行，都可以。'但其实我超级介意。",
    optionB: "…我当时觉得作为翔翔最好的朋友，我有责任去主动解决这个问题。所以我去找过那个邻居，想约他一起打场球把话说开，结果他只是冷淡地应付了我几句，场面比之前更尴尬了。",
    correctAnswer: 'A',
    hasReward: true // 第1题有彩蛋
  },
  {
    id: 2,
    title: "'爱情导师'的内心",
    background: "我小学的时候，我有一个女同桌，跟我关系很好，但是就像是哥们那样，她人比较酷辣，生人勿近，同时我有另外一个男同学喜欢这个女孩，他又知道我跟我这个女同桌关系很好，他想让我教他怎么追这个女孩，或者问我她喜欢什么之类的问题。",
    optionA: "…我那时候说了很多很扯的东西，但是我那时候就是那么想的，我也不知道他要怎么追那个女孩。所以我给他出过一些什么'你要戴一个无框眼镜，然后找一个项链，戴个什么戒指'这种主意。",
    optionB: "…我当时觉得不知道怎么直接给建议，最好的方式是'现场教学'。于是给他演示，我就会故意和我同桌打闹、开一些只有我们懂的玩笑，想让他看看我是怎么做的，结果他好像完全没学到，反而更不敢接近我同桌了。",
    correctAnswer: 'A',
    hasReward: false // 第2题无彩蛋
  },
  {
    id: 3,
    title: "弄丢眼镜之后",
    background: "我上初中的时候，有一次出去玩，把眼镜给弄丢了。然后我就很担心回去会让我爸感到失望，他不一定会对我很凶，但是我不想让他感到失望。然后我也不知道该怎么办…",
    optionA: "…我就和我朋友在楼下哭。我在那哭，然后就是不要回家，就是不要回家，最后很晚我才被朋友安抚好了回家。",
    optionB: "…我当时第一个念头是'解决问题'，只要在他发现前买副新的就行。于是我拉着我朋友，跑了好几家眼镜店想找个一模一样的，结果发现钱根本不够，最后只好放弃了。",
    correctAnswer: 'A',
    hasReward: true // 第3题有彩蛋
  },
  {
    id: 4,
    title: "被撞破的秘密",
    background: "6年级暑假有次我跟初恋一起上山玩的时候，遇见了我们住的附近地方的比较远的邻居。",
    optionA: "…然后当时她还很担心回家之后那些邻居如果告诉他爸妈我们六年级谈恋爱这件事情就被发现了。（我看着她担心的样子，心里也跟着紧张起来，开始想各种借口来应对可能发生的情况。）",
    optionB: "…我当时心里完全没有担心，反而有种莫名的、叛逆的兴奋感。我甚至故意牵着她的手没放，从邻居身边走过，感觉自己像个电影里的主角，正在做一件了不起的大事。",
    correctAnswer: 'A',
    hasReward: false // 第4题无彩蛋
  },
  {
    id: 5,
    title: "'天才'的两种心态",
    background: "我小的时候觉得自己以后会成为像爱因斯坦、牛顿那样的人，甚至更厉害。那时候就是觉得自己比身边所有人都聪明很多很多，而且是一种毫不费力的聪明。",
    optionA: "可能有蛮长的时间里，一年两年里，我都特别狂，觉得牛顿、爱因斯坦只是因为生在了我前面，所以比我先发现了那些物理定律。",
    optionB: "很快冷静几天其实就对他们怀有巨大的敬畏之心，觉得我要做到这些还有很长的路要走。",
    correctAnswer: 'A',
    hasReward: true // 第5题有彩蛋
  },
  {
    id: 6,
    title: "赛场上的我",
    background: "我初中的时候打篮球，感觉上篮的成功率非常高，基本没人拦得住我。但是有一次比赛的时候，对方的防守强度特别大…",
    optionA: "…我上场没多久就被犯规、被打手，出现了好几次失误，然后就被教练换下，感觉特别受挫。",
    optionB: "…对方的防守反而激起了我的好胜心。我没有退缩，反而打得比平时更专注，不断地突破和得分，那场比赛成了我超常发挥的代表。",
    correctAnswer: 'A',
    hasReward: false // 第6题无彩蛋
  },
  {
    id: 7,
    title: "厨房里的创造",
    background: "我小时候有次去我小姑家里，在那玩烹饪游戏，研究怎么把鸡蛋煎出金黄色，然后在那煎了很多很多蛋，后面被说了。",
    optionA: "…然后还做一些很奇怪的菜，比如煮一些虾仁，然后在里面倒红酒、紫菜，在那里乱搞，又被说了。",
    optionB: "…那次被说了一顿之后，我就不是很敢了，所以后面没再乱搞过。",
    correctAnswer: 'A',
    hasReward: false // 第7题无彩蛋
  },
  {
    id: 8,
    title: "ATM机前的我",
    background: "我的一个很奇怪的触发点是，我在那个银行的24小时存取的ATM机面前，会控制不住地变得…",
    optionA: "…很紧张。心里面好像什么都没想，但就是整个身体变得很紧张。然后后面有的时候我路过的时候还会进去，哪怕不取钱，专门在那里暴露一下，在那个环境里，感受一种脱敏，一种适应。",
    optionB: "…很平静。那个狭小的、有机器运作声音的独立空间，反而让我有一种奇怪的安全感。有时候心情烦躁，我甚至会故意走进去待一分钟，感觉能和外面的世界暂时隔绝。",
    correctAnswer: 'A',
    hasReward: true // 第8题有彩蛋
  },
  {
    id: 9,
    title: "夜路上的启蒙",
    background: "六年级的时候，来到上海。然后有一次晚上我一个人出来，在外面走路，穿过好几条街，走过好多个路口，去到黄浦江边。我们当时在徐汇住。我一个人在外面走夜路，然后在有一个商场旁边的时候，有一个穿着白衬衫的瘦瘦高高的男生从我旁边走过去了。他身上的香水味道很大…",
    optionA: "…那时候我并没有觉得反感，我反而觉得，原来长大会有一种选择是可以变成一个香香的大人，好像心里还有点期待。",
    optionB: "…那个味道在那一瞬间让我觉得很突兀和不安。在我的认知里，只有大人和特定的场合才会有这种味道，它像一个信号，提醒我这是一个我还不了解的、复杂的成人世界。",
    correctAnswer: 'A',
    hasReward: true // 第9题有彩蛋
  }
];

// About You 彩蛋内容 - 按题号对应的5段话
const aboutYouRewards = {
  1: `我们第一次见面的时候握手。我发现那时候我就发现我特别喜欢跟你有肢体接触，那时候我就想抱抱你，但是我没好意思说。`,
  3: `我们第一次在南京见面的时候，你进门跟虎子玩。第一天你穿的那个裙子，虽然有安全裤，但是你背对着我趴在那个沙发上，弯下腰去跟虎子玩的时候，我瞥见你一眼，但是不敢去继续看你，因为发现我的身体开始有反应。`,
  5: `在我们认识之后的时间里，很久之前就开始，有很多时候我因为生活中的事情不是那么开心，有点低迷，或者有点失落，甚至是有的时候一点难过的时候，我总是会想到你来让自己变开心，来让自己变满足，很长时间里，我在心里对你有感激之情，因为我想到你的时候总是能安慰我自己很多。但是我不敢向你表现得太明显，仿佛会打破一种平衡。如果我表现得特别特别感谢你，我也会担心吓到你，或者给你压力，你就不像原来那样做自己了。`,
  8: `我想过，如果以后条件允许的话，想跟你去很多很多地方。想过跟你住在岛上，住在海边，住在顶楼，住在小院。想到这些的时候，会想到我们在这些地方会有很亲密的身体接触，会抱在一起，会搂着你，会靠很近，心里也是。`,
  9: `很多时候我会担心自己对你来说不够好。我想你那么漂亮，有那么洋溢的感情，那么有灵性。但是我又是一个有点自私的人，我在想也许你没有注意到这些差距，没有注意到我不够好的部分。也许你以后才注意到，说不定都晚了。我会按下这些自我怀疑。我在想，反正我有这么好的运气遇到你，上天偶尔青睐我一下，我要抓住机会。`
};

// 根据题号获取对应的彩蛋内容
export function getAboutYouReward(questionId: number): string {
  return aboutYouRewards[questionId as keyof typeof aboutYouRewards] || '';
}

// 保持向后兼容的默认导出
export const aboutYouReward = aboutYouRewards[1];

// 随机化选项顺序的函数
function shuffleOptions(question: Question): GameQuestion {
  const shouldSwap = Math.random() < 0.5;
  
  if (shouldSwap) {
    return {
      id: question.id,
      title: question.title,
      background: question.background,
      options: [
        {
          text: question.optionB,
          isCorrect: question.correctAnswer === 'B',
          originalOption: 'B'
        },
        {
          text: question.optionA,
          isCorrect: question.correctAnswer === 'A',
          originalOption: 'A'
        }
      ],
      hasReward: question.hasReward
    };
  } else {
    return {
      id: question.id,
      title: question.title,
      background: question.background,
      options: [
        {
          text: question.optionA,
          isCorrect: question.correctAnswer === 'A',
          originalOption: 'A'
        },
        {
          text: question.optionB,
          isCorrect: question.correctAnswer === 'B',
          originalOption: 'B'
        }
      ],
      hasReward: question.hasReward
    };
  }
}

// 获取随机化后的游戏题目
export function getGameQuestions(): GameQuestion[] {
  return rawQuestions.map(question => shuffleOptions(question));
}

// 获取特定题目
export function getQuestionById(id: number): GameQuestion | undefined {
  const question = rawQuestions.find(q => q.id === id);
  return question ? shuffleOptions(question) : undefined;
}

// 检查是否有彩蛋掉落
export function hasRewardDrop(questionId: number): boolean {
  const rewardQuestions = [1, 3, 5, 8, 9];
  return rewardQuestions.includes(questionId);
}

// 获取无彩蛋时的提示消息
export const noRewardMessage = "也许下一个有掉落";

// 获取彩蛋成功消息
export const rewardSuccessMessage = "恭喜获得随机About You掉落";