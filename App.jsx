import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════
// 問題データ
// ════════════════════════════════════════════════════════════
const QUESTIONS = {
  translation: {
    beginner: [
      { id:"t-b-1", jp:"今日は天気がいいですね。", hint:"天気・挨拶", answers:["it's a nice day today","it is a nice day today","the weather is nice today","it's good weather today"], model:"It's a nice day today.", points:[{text:"「天気がいい」は It's a nice day. または The weather is nice. が自然です。"},{text:"文末に today を置くと「今日は」のニュアンスが強まります。"}], alternative:"What beautiful weather we're having today!" },
      { id:"t-b-2", jp:"私は毎朝コーヒーを飲みます。", hint:"習慣・日課", answers:["i drink coffee every morning","i have coffee every morning","i drink a cup of coffee every morning"], model:"I drink coffee every morning.", points:[{text:"習慣を表すには現在形を使います。"},{text:"drink の代わりに have も自然です。"}], alternative:"I have a cup of coffee every morning without fail." },
      { id:"t-b-3", jp:"この本は面白いと思います。", hint:"意見・感想", answers:["i think this book is interesting","i find this book interesting","i think this book is fun"], model:"I think this book is interesting.", points:[{text:"意見を述べるには I think ... が基本です。"},{text:"I find this book interesting. はより洗練された表現です。"}], alternative:"I find this book quite fascinating." },
      { id:"t-b-4", jp:"彼女は昨日学校を休みました。", hint:"過去形・欠席", answers:["she was absent from school yesterday","she didn't go to school yesterday","she missed school yesterday"], model:"She was absent from school yesterday.", points:[{text:"「学校を休む」は be absent from school または miss school です。"},{text:"didn't go to school も正しいカジュアルな表現です。"}], alternative:"She took a day off from school yesterday." },
      { id:"t-b-5", jp:"もう少し早く起きればよかった。", hint:"後悔・wish構文", answers:["i wish i had woken up a little earlier","i should have woken up earlier","i wish i had gotten up earlier"], model:"I wish I had woken up a little earlier.", points:[{text:"後悔を表す「〜すればよかった」は I wish I had + 過去分詞 です。"},{text:"should have + 過去分詞 も同様の意味で使えます。"}], alternative:"I should have set my alarm a bit earlier." },
      { id:"t-b-6", jp:"私の兄は医者として働いています。", hint:"職業", answers:["my brother works as a doctor","my older brother works as a doctor","my brother is working as a doctor"], model:"My brother works as a doctor.", points:[{text:"職業を表すには work as ... が自然です。"},{text:"「兄」は older brother、「弟」は younger brother です。"}], alternative:"My brother is employed as a physician." },
      { id:"t-b-7", jp:"この映画は3時間以上あります。", hint:"時間の長さ", answers:["this movie is more than three hours long","this movie lasts more than three hours","this movie runs for more than three hours"], model:"This movie is more than three hours long.", points:[{text:"「〜時間ある」は be + 時間 + long または last で表します。"},{text:"run for ... も映画の長さに使う自然な表現です。"}], alternative:"This film runs for over three hours." },
      { id:"t-b-8", jp:"彼はとても忙しかったので、昼食を食べる時間がありませんでした。", hint:"so...that", answers:["he was so busy that he didn't have time to eat lunch","he was too busy to eat lunch","he had no time to eat lunch because he was so busy"], model:"He was so busy that he didn't have time to eat lunch.", points:[{text:"so ... that 構文は「とても〜なので…」という因果関係を表します。"},{text:"too ... to も同様の意味で使えます。"}], alternative:"He was far too swamped to take a lunch break." },
      { id:"t-b-9", jp:"子供の頃、よく祖父母の家に遊びに行きました。", hint:"used to・子供の頃", answers:["when i was a child i often visited my grandparents' house","i used to visit my grandparents often when i was a child","as a child i would often go to my grandparents' house"], model:"When I was a child, I often visited my grandparents' house.", points:[{text:"「よく〜した（過去の習慣）」は used to または would で表します。"},{text:"when I was a child と as a child は同じ意味で使えます。"}], alternative:"I used to visit my grandparents' place all the time as a kid." },
      { id:"t-b-10", jp:"彼女が言ったことが信じられません。", hint:"関係代名詞・what", answers:["i can't believe what she said","i cannot believe what she said","i find it hard to believe what she said"], model:"I can't believe what she said.", points:[{text:"「彼女が言ったこと」は what she said と関係代名詞 what を使います。"},{text:"I find it hard to believe ... はより丁寧な言い方です。"}], alternative:"What she said is simply beyond belief." },
    ],
    intermediate: [
      { id:"t-i-1", jp:"彼女がなぜ遅刻したのか理由がわかりません。", hint:"間接疑問文", answers:["i don't know why she was late","i don't know the reason why she was late","i have no idea why she was late"], model:"I don't know why she was late.", points:[{text:"間接疑問文は「why + 主語 + 動詞」の語順になります。"},{text:"I have no idea why... はよりくだけた自然な表現です。"}], alternative:"I have no idea why she arrived late." },
      { id:"t-i-2", jp:"もっと早く出発していれば、電車に間に合ったのに。", hint:"仮定法過去完了", answers:["if i had left earlier i would have caught the train","if i had departed earlier i would have made it to the train","had i left earlier i would have caught the train"], model:"If I had left earlier, I would have caught the train.", points:[{text:"仮定法過去完了：If + had + 過去分詞, would have + 過去分詞 の形です。"},{text:"「電車に間に合う」は catch the train または make it to the train です。"}], alternative:"Had I left a bit earlier, I could have made the train." },
      { id:"t-i-3", jp:"彼は以前ほど頻繁に運動しなくなっています。", hint:"比較・変化", answers:["he doesn't exercise as often as he used to","he exercises less frequently than before","he doesn't work out as much as he used to"], model:"He doesn't exercise as often as he used to.", points:[{text:"「以前ほど〜でない」は not as ... as he used to が自然です。"},{text:"used to は「かつては〜だった」という変化を示します。"}], alternative:"He works out far less frequently than he once did." },
      { id:"t-i-4", jp:"その映画を見て感動して泣いてしまいました。", hint:"感情・結果", answers:["i was so moved by the movie that i cried","the movie moved me to tears","i cried because i was so touched by the movie"], model:"I was so moved by the movie that I cried.", points:[{text:"so ... that 構文で感情の強さと結果を同時に表せます。"},{text:"move someone to tears は「感動して涙が出る」という慣用表現です。"}], alternative:"The film moved me to tears." },
      { id:"t-i-5", jp:"彼女が成功したのは、努力を惜しまなかったからです。", hint:"強調・理由", answers:["the reason she succeeded is that she never spared any effort","she succeeded because she never stopped making efforts","it is because she worked tirelessly that she succeeded"], model:"The reason she succeeded is that she never spared any effort.", points:[{text:"「努力を惜しまない」は spare no effort または work tirelessly です。"},{text:"It is because ... that ... の強調構文も使えます。"}], alternative:"Her success is entirely attributable to her relentless dedication." },
      { id:"t-i-6", jp:"その問題を解決するのに3時間かかりました。", hint:"It takes", answers:["it took three hours to solve the problem","it took me three hours to solve the problem","solving the problem took three hours"], model:"It took me three hours to solve the problem.", points:[{text:"「〜するのに時間がかかる」は It takes + 時間 + to do の形です。"},{text:"過去形は took を使います。"}], alternative:"Three hours were needed to work through that problem." },
      { id:"t-i-7", jp:"もし時間があれば、もっと本を読みたいのですが。", hint:"仮定法現在", answers:["if i had more time i would read more books","if i had time i would read more","i would read more books if i had the time"], model:"If I had more time, I would read more books.", points:[{text:"仮定法現在（現在の事実と反対）：If + 過去形, would + 原形 です。"},{text:"had は have の過去形で、「今もし持っていたら」という意味を表します。"}], alternative:"Were I to have more free time, I'd certainly read a great deal more." },
      { id:"t-i-8", jp:"この計画が成功するかどうかはあなた次第です。", hint:"whether・depend on", answers:["whether this plan succeeds or not depends on you","it depends on you whether this plan will succeed","the success of this plan depends on you"], model:"Whether this plan succeeds or not depends on you.", points:[{text:"「〜かどうか」は whether ... or not です。"},{text:"depend on は「〜次第だ、〜に依存する」という意味です。"}], alternative:"The outcome of this plan rests entirely in your hands." },
      { id:"t-i-9", jp:"彼が言ったことは必ずしも正しいとは限りません。", hint:"部分否定", answers:["what he said is not necessarily true","what he said is not always correct","it is not always the case that what he said is right"], model:"What he said is not necessarily true.", points:[{text:"「必ずしも〜ではない」は not necessarily ... で部分否定を表します。"},{text:"not always も同様の意味の部分否定表現です。"}], alternative:"There is no guarantee that everything he said holds true." },
      { id:"t-i-10", jp:"彼女は私が思っていた以上に英語が上手でした。", hint:"比較・予想を超える", answers:["her english was better than i had expected","she spoke english better than i thought","her english was much better than i had imagined"], model:"Her English was better than I had expected.", points:[{text:"「思っていた以上に」は better than I had expected または more than I thought です。"},{text:"期待・予想を表す動詞は過去完了にすると丁寧です。"}], alternative:"She spoke English far more fluently than I had anticipated." },
    ],
    advanced: [
      { id:"t-a-1", jp:"経済格差の拡大が社会の結束を損なうという懸念が高まっています。", hint:"社会問題", answers:["there is growing concern that widening economic inequality undermines social cohesion","concerns are growing that the widening economic gap undermines social solidarity"], model:"There is growing concern that widening economic inequality undermines social cohesion.", points:[{text:"「懸念が高まる」は There is growing concern that ... が定番表現。"},{text:"「損なう」は undermine または erode が適切です。"}], alternative:"Mounting concerns suggest that the widening economic divide is eroding the fabric of social solidarity." },
      { id:"t-a-2", jp:"この政策の有効性については、専門家の間でも意見が分かれています。", hint:"学術的表現", answers:["experts are divided on the effectiveness of this policy","opinions are divided among experts on the effectiveness of this policy"], model:"Experts are divided on the effectiveness of this policy.", points:[{text:"「意見が分かれる」は be divided on ... が適切。"},{text:"「有効性」は effectiveness または efficacy です。"}], alternative:"The efficacy of this policy remains a point of contention even among leading scholars." },
      { id:"t-a-3", jp:"グローバル化が進む中で、文化的アイデンティティをどう保つかが問われています。", hint:"グローバル社会", answers:["as globalization advances the question of how to preserve cultural identity is being raised","in the era of globalization the question of how to maintain cultural identity is increasingly important"], model:"As globalization advances, the question of how to preserve cultural identity is being raised.", points:[{text:"「〜が問われている」は the question of ... is being raised が適切。"},{text:"as ... advances で「〜が進む中で」という状況を表せます。"}], alternative:"In an era of accelerating globalization, the challenge of safeguarding cultural identity has never been more pressing." },
      { id:"t-a-4", jp:"長期的な視点で見れば、環境への投資は経済的にも合理的です。", hint:"環境経済", answers:["from a long-term perspective investment in the environment is economically rational","in the long run investing in the environment makes economic sense"], model:"From a long-term perspective, investment in the environment is economically rational.", points:[{text:"「長期的な視点で」は from a long-term perspective または in the long run です。"},{text:"make economic sense は「経済的に合理的だ」という自然な表現です。"}], alternative:"Viewed over the long term, environmental investment represents sound economic reasoning." },
      { id:"t-a-5", jp:"急速な技術革新は、私たちの働き方を根本から変えつつあります。", hint:"技術・変革", answers:["rapid technological innovation is fundamentally changing the way we work","rapid advances in technology are transforming the way we work at its core"], model:"Rapid technological innovation is fundamentally changing the way we work.", points:[{text:"「根本から変える」は fundamentally change または transform at its core です。"},{text:"the way we work は「私たちの働き方」を表す自然な表現です。"}], alternative:"The breakneck pace of technological advancement is reshaping the very nature of how we work." },
      { id:"t-a-6", jp:"個人の自由と社会的責任のバランスをとることは、民主主義社会の永遠の課題です。", hint:"民主主義・倫理", answers:["balancing individual freedom and social responsibility is a perennial challenge in democratic societies"], model:"Balancing individual freedom and social responsibility is a perennial challenge in democratic societies.", points:[{text:"perennial は「永続的な、長年の」という意味の形容詞です。"},{text:"動名詞 Balancing ... is ... の構文で主語を作れます。"}], alternative:"Striking the right balance between personal liberty and collective responsibility remains democracy's enduring dilemma." },
      { id:"t-a-7", jp:"先進国は、温暖化問題に対して途上国よりも大きな責任を負うべきだという主張がある。", hint:"環境・国際責任", answers:["some argue that developed countries should bear greater responsibility for global warming than developing countries","there is an argument that developed nations have greater responsibility for climate change than developing ones"], model:"Some argue that developed countries should bear greater responsibility for global warming than developing countries.", points:[{text:"「主張がある」は Some argue that ... が自然です。"},{text:"bear responsibility for ... は「〜に対して責任を負う」という表現です。"}], alternative:"A compelling case can be made that industrialized nations are obligated to shoulder a disproportionately greater burden in combating climate change." },
      { id:"t-a-8", jp:"いかなる状況においても、人権は尊重されなければならない。", hint:"人権・普遍的価値", answers:["human rights must be respected under any circumstances","under any circumstances human rights must be respected","regardless of the situation human rights must be upheld"], model:"Human rights must be respected under any circumstances.", points:[{text:"「いかなる状況においても」は under any circumstances または regardless of the situation です。"},{text:"uphold は respect よりも積極的なニュアンスがあります。"}], alternative:"Under no circumstances should human rights ever be compromised." },
      { id:"t-a-9", jp:"科学的証拠に基づいた政策立案がこれまで以上に求められています。", hint:"evidence-based", answers:["evidence-based policymaking is more important than ever","policy based on scientific evidence is required now more than ever"], model:"Evidence-based policymaking is more important than ever.", points:[{text:"evidence-based は「証拠に基づいた」という複合形容詞で学術・政策論で頻出です。"},{text:"more ... than ever は「これまで以上に〜」という強調表現です。"}], alternative:"The imperative for scientifically grounded policy decisions has never been greater." },
      { id:"t-a-10", jp:"多様性を尊重する社会こそが、真のイノベーションを生み出す土壌となる。", hint:"多様性・イノベーション", answers:["a society that respects diversity is the fertile ground for true innovation","it is a society that values diversity that can foster genuine innovation"], model:"A society that respects diversity is the fertile ground for true innovation.", points:[{text:"fertile ground for ... は「〜を育む土壌」という慣用表現です。"},{text:"関係代名詞 that を使い強調を表します。"}], alternative:"Only a society that genuinely embraces diversity can cultivate the conditions in which true innovation flourishes." },
    ],
  },
  enja: {
    beginner: [
      { id:"e-b-1", en:"I wake up at seven every morning.", hint:"毎朝の習慣", answers:["私は毎朝7時に起きます","私は毎朝7時に目が覚めます","毎朝7時に起きます"], model:"私は毎朝7時に起きます。", points:[{text:"wake up は「目が覚める、起きる」という意味の句動詞です。"},{text:"every morning は「毎朝」。every + 単数名詞が習慣を表します。"}], alternative:"毎朝7時に目を覚ます習慣があります。" },
      { id:"e-b-2", en:"She has two cats and one dog.", hint:"所有・数", answers:["彼女は猫を2匹と犬を1匹飼っています","彼女には猫が2匹と犬が1匹います"], model:"彼女は猫を2匹と犬を1匹飼っています。", points:[{text:"have はここで「飼っている、持っている」の意味です。"},{text:"cats（複数）・dog（単数）の数に注意しましょう。"}], alternative:"彼女のペットは猫2匹と犬1匹です。" },
      { id:"e-b-3", en:"It is raining outside right now.", hint:"現在進行形・天気", answers:["今外は雨が降っています","ただいま外は雨です","今現在、外で雨が降っています"], model:"今、外は雨が降っています。", points:[{text:"is raining は現在進行形で「今まさに降っている」状態を表します。"},{text:"right now は「今まさに、ちょうど今」という意味です。"}], alternative:"ただいま外は雨が降っているところです。" },
      { id:"e-b-4", en:"I like playing soccer with my friends.", hint:"趣味・好き嫌い", answers:["私は友達とサッカーをするのが好きです","友達とサッカーをすることが好きです"], model:"私は友達とサッカーをするのが好きです。", points:[{text:"like + 動名詞（playing）で「〜するのが好き」を表します。"},{text:"with my friends は「友達と一緒に」という意味です。"}], alternative:"友人たちとサッカーをすることが大好きです。" },
      { id:"e-b-5", en:"This restaurant is very popular among young people.", hint:"人気・若者", answers:["このレストランは若者の間でとても人気があります","このレストランは若い人たちにとても人気です"], model:"このレストランは若者の間でとても人気があります。", points:[{text:"popular among ... は「〜の間で人気がある」という表現です。"},{text:"young people は「若者、若い人たち」という意味です。"}], alternative:"このお店は若い世代にたいへん人気を博しています。" },
      { id:"e-b-6", en:"He forgot to bring his umbrella today.", hint:"忘れる・to不定詞", answers:["彼は今日傘を持ってくるのを忘れました","今日、彼は傘を忘れてきました"], model:"彼は今日傘を持ってくるのを忘れました。", points:[{text:"forget to do は「〜することを忘れる」（未来の行為を忘れる）という意味です。"},{text:"bring は「持ってくる」で、take（持っていく）と区別しましょう。"}], alternative:"彼は今日、傘を忘れて出かけてしまいました。" },
      { id:"e-b-7", en:"Can you help me carry these boxes?", hint:"依頼・手伝い", answers:["これらの箱を運ぶのを手伝ってもらえますか","この箱を運ぶのを手伝ってくれますか"], model:"これらの箱を運ぶのを手伝ってもらえますか？", points:[{text:"Can you help me + 動詞の原形 は「〜するのを手伝ってもらえますか」という依頼表現です。"},{text:"carry は「運ぶ」、these boxes は「これらの箱（複数）」です。"}], alternative:"これらの箱を一緒に運んでいただけますか？" },
      { id:"e-b-8", en:"I went to the library to study for the exam.", hint:"目的・to不定詞", answers:["私は試験のために勉強しに図書館へ行きました","試験勉強のために図書館に行きました"], model:"私は試験勉強のために図書館に行きました。", points:[{text:"to study は「勉強するために」という目的を表す不定詞です。"},{text:"study for the exam は「試験に向けて勉強する」という意味です。"}], alternative:"試験に備えて図書館で勉強してきました。" },
      { id:"e-b-9", en:"My mother cooks dinner for our family every evening.", hint:"家族・日課", answers:["母は毎晩家族のために夕食を作ります","私の母は毎晩家族のために夕食を作ります"], model:"母は毎晩、家族のために夕食を作ります。", points:[{text:"cook dinner は「夕食を作る」。cook は動詞として使います。"},{text:"every evening は「毎晩」という意味です。"}], alternative:"私の母は毎晩、家族のために夕食を用意してくれます。" },
      { id:"e-b-10", en:"I have never been to Europe before.", hint:"経験・現在完了", answers:["私はこれまでヨーロッパに行ったことがありません","ヨーロッパには一度も行ったことがありません"], model:"私はこれまでヨーロッパに行ったことがありません。", points:[{text:"have never been to ... は「〜に行ったことがない」という経験の現在完了です。"},{text:"before は現在完了と共に使い「これまでに」という意味を強調します。"}], alternative:"ヨーロッパへは一度も足を運んだことがありません。" },
    ],
    intermediate: [
      { id:"e-i-1", en:"I don't know whether she will come to the party or not.", hint:"whether・間接疑問", answers:["彼女がパーティーに来るかどうかわかりません","彼女がパーティーに来るかどうか私にはわかりません"], model:"彼女がパーティーに来るかどうかわかりません。", points:[{text:"whether ... or not は「〜かどうか」という間接疑問文を作る表現です。"},{text:"I don't know + 間接疑問文の語順（主語+動詞）に注意しましょう。"}], alternative:"彼女がパーティーに参加するかどうかは定かではありません。" },
      { id:"e-i-2", en:"The project was so complex that it took us three months to complete.", hint:"so...that・時間", answers:["そのプロジェクトはとても複雑で完成するのに3ヶ月かかりました","プロジェクトが非常に複雑だったため完成までに3ヶ月を要しました"], model:"そのプロジェクトはとても複雑で、完成するのに3ヶ月かかりました。", points:[{text:"so ... that ... は「とても〜なので…」という結果を表す構文です。"},{text:"it took us + 時間 + to do は「〜するのに（時間が）かかった」という表現です。"}], alternative:"プロジェクトの複雑さゆえ、完了までに実に3ヶ月を費やしました。" },
      { id:"e-i-3", en:"She must have forgotten about our meeting today.", hint:"must have+過去分詞", answers:["彼女は今日の私たちの会議のことを忘れてしまったに違いありません","彼女は今日のミーティングを忘れたに違いない"], model:"彼女は今日の会議のことを忘れてしまったに違いありません。", points:[{text:"must have + 過去分詞は「〜したに違いない」という過去の確信的推量です。"},{text:"forget about ... は「〜のことを忘れる」という表現です。"}], alternative:"今日のミーティングをすっかり失念してしまったのでしょう。" },
      { id:"e-i-4", en:"No matter how hard I try, I can't seem to master this skill.", hint:"no matter how・譲歩", answers:["どれだけ頑張ってもこのスキルをマスターできないようです","どんなに努力しても、このスキルを習得できないようです"], model:"どれだけ頑張っても、このスキルをマスターできないようです。", points:[{text:"No matter how + 形容詞/副詞 は「どんなに〜でも」という譲歩の副詞節です。"},{text:"can't seem to do は「どうも〜できないようだ」という控えめな表現です。"}], alternative:"いくら努力を重ねても、このスキルの習得はなかなか難しいようです。" },
      { id:"e-i-5", en:"The more you practice, the more confident you will become.", hint:"The+比較級,the+比較級", answers:["練習すればするほど自信がつきます","練習すればするほど、より自信を持てるようになります"], model:"練習すればするほど、より自信がつきます。", points:[{text:"The + 比較級, the + 比較級 は「〜すればするほど…」という比例の構文です。"},{text:"confident は「自信のある」という形容詞です。"}], alternative:"練習を重ねるほど、それだけ自信が育まれていきます。" },
      { id:"e-i-6", en:"He could have passed the exam if he had studied harder.", hint:"仮定法過去完了", answers:["もっと一生懸命勉強していたら彼は試験に合格できたのに","もし彼がもっと勉強していれば試験に合格できたでしょう"], model:"もっと一生懸命勉強していたら、試験に合格できたのに。", points:[{text:"could have + 過去分詞は「〜できたのに（実際はできなかった）」という意味です。"},{text:"if + 過去完了 は仮定法過去完了の条件節です。"}], alternative:"もう少し勉強に励んでいれば、合格できていたはずです。" },
      { id:"e-i-7", en:"I was told that the meeting had already been canceled.", hint:"受動態・過去完了", answers:["会議はすでにキャンセルされたと聞きました","私は会議がすでにキャンセルされたと言われました"], model:"会議はすでにキャンセルされたと知らされました。", points:[{text:"I was told that ... は「〜と知らされた／聞かされた」という受動表現です。"},{text:"had already been canceled は過去完了の受動態で、さらに前の出来事を表します。"}], alternative:"会議がすでに中止になっていたという連絡を受けました。" },
      { id:"e-i-8", en:"What makes this company stand out is its commitment to innovation.", hint:"what節・強調", answers:["この会社が際立っている理由はイノベーションへの取り組みです","この会社が目立つのはイノベーションへの献身です"], model:"この会社が際立っている理由は、イノベーションへの取り組みです。", points:[{text:"What makes ... は「〜を…にしているもの」という what の名詞節です。"},{text:"stand out は「際立つ、目立つ」という意味の句動詞です。"}], alternative:"この会社の強みは、革新に対する揺るぎないコミットメントにあります。" },
      { id:"e-i-9", en:"Despite the difficulties, she managed to complete the project on time.", hint:"despite・manage to", answers:["困難にもかかわらず、彼女はなんとかプロジェクトを期限内に完成させました","難しい状況にもかかわらず彼女はプロジェクトを時間通りに完了させました"], model:"困難にもかかわらず、彼女はなんとかプロジェクトを期限内に完成させました。", points:[{text:"Despite + 名詞/動名詞 は「〜にもかかわらず」という譲歩の前置詞句です。"},{text:"manage to do は「なんとか〜する、どうにか〜することができる」という表現です。"}], alternative:"多くの困難を乗り越え、彼女はプロジェクトを期日通りに仕上げました。" },
      { id:"e-i-10", en:"It is not the strongest of the species that survive, but the most adaptable.", hint:"強調構文・適者生存", answers:["生き残るのは最も強い種ではなく最も適応能力の高い種です","生き延びるのは最も強い者ではなく最も適応できる者です"], model:"生き残るのは最も強い種ではなく、最も適応能力の高い種です。", points:[{text:"It is not A but B that ... は「〜するのはAではなくBだ」という強調構文です。"},{text:"adaptable は「適応能力のある、順応性のある」という形容詞です。"}], alternative:"存続するのは最強の種ではなく、変化に最も柔軟に対応できる種にほかなりません。" },
    ],
    advanced: [
      { id:"e-a-1", en:"The notion that economic growth and environmental sustainability are mutually exclusive is increasingly being challenged.", hint:"notion that・受動態", answers:["経済成長と環境の持続可能性は相互に相容れないという考えがますます問われています","経済成長と環境の持続可能性が両立しないという考え方はますます挑戦を受けています"], model:"経済成長と環境の持続可能性は相互に相容れないという考えは、ますます疑問視されています。", points:[{text:"The notion that ... は「〜という考え・概念」を表す同格の that 節です。"},{text:"mutually exclusive は「相互に相容れない、二律背反の」という意味です。"}], alternative:"経済発展と環境保全は両立しないとする通説は、近年その妥当性が問われるようになってきています。" },
      { id:"e-a-2", en:"Unprecedented advances in artificial intelligence are compelling us to reconsider what it means to be human.", hint:"compelling・reconsider", answers:["人工知能における前例のない進歩は私たちに人間であることの意味を再考させています","AIの前例のない進化により人間であることの意味を再考することを余儀なくされています"], model:"人工知能における前例のない進歩は、私たちに「人間であること」の意味を再考させています。", points:[{text:"unprecedented は「前例のない、空前の」という形容詞です。"},{text:"compel someone to do は「〜することを強いる、余儀なくさせる」という意味です。"}], alternative:"AIの飛躍的な発展は、私たちに「人間とは何か」という根本的な問いを突きつけています。" },
      { id:"e-a-3", en:"While globalization has brought unprecedented prosperity to many, it has simultaneously widened the gap between the haves and the have-nots.", hint:"while・格差", answers:["グローバル化は多くの人に前例のない繁栄をもたらした一方で富裕層と貧困層の格差を同時に広げました","グローバル化は多くの人々に空前の豊かさをもたらしたが同時に持てる者と持たざる者の格差も拡大した"], model:"グローバル化は多くの人々に前例のない繁栄をもたらした一方で、持てる者と持たざる者の格差も広げました。", points:[{text:"While ... は「〜する一方で」という譲歩・対比を表す接続詞です。"},{text:"the haves and the have-nots は「持てる者と持たざる者」という定型表現です。"}], alternative:"グローバル化は空前の経済的繁栄をもたらしたと同時に、富める者と貧しき者の溝を一段と深めました。" },
      { id:"e-a-4", en:"A society that fails to invest in education is, in effect, mortgaging its own future.", hint:"mortgage・比喩表現", answers:["教育に投資しない社会は事実上自国の未来を担保に入れているようなものです","教育への投資を怠る社会は実質的に自らの未来を抵当に入れていることになります"], model:"教育に投資しない社会は、事実上、自国の未来を抵当に入れているようなものです。", points:[{text:"mortgage（動詞）はここで「〜を抵当に入れる、担保にする」という比喩的な意味です。"},{text:"in effect は「事実上、実質的に」という意味の副詞句です。"}], alternative:"教育への投資を惜しむ社会は、自らの将来を担保に取っているに等しいと言えます。" },
      { id:"e-a-5", en:"The transition to a low-carbon economy, while disruptive in the short term, is an indispensable step toward long-term sustainability.", hint:"transition・indispensable", answers:["低炭素経済への移行は短期的には混乱をもたらすものの長期的な持続可能性に向けた不可欠な一歩です","脱炭素経済への転換は短期的には破壊的であるが長期的な持続可能性のためには欠かせない段階です"], model:"低炭素経済への移行は、短期的には混乱をもたらすものの、長期的な持続可能性に向けた不可欠な一歩です。", points:[{text:"while disruptive in the short term は「短期的には混乱をもたらすものの」という譲歩の表現です。"},{text:"indispensable は「不可欠な、必須の」という形容詞です。"}], alternative:"脱炭素経済への転換は近い将来において相応の混乱を伴いますが、持続可能な社会の実現に向けては避けて通れない道です。" },
      { id:"e-a-6", en:"Excessive dependence on a single industry makes an economy inherently vulnerable to external shocks.", hint:"dependence・vulnerable", answers:["単一産業への過度な依存は経済を本質的に外部ショックに脆弱にします","特定の産業への過度な依存は経済を外部衝撃に対して本質的に脆弱にする"], model:"単一産業への過度な依存は、経済を本質的に外部ショックに対して脆弱にします。", points:[{text:"excessive dependence on ... は「〜への過度な依存」という表現です。"},{text:"inherently vulnerable to ... は「本質的に〜に対して脆弱」という意味です。"}], alternative:"特定の産業に依存しすぎる経済は、外的要因による打撃に対して構造的な弱さを抱えることになります。" },
      { id:"e-a-7", en:"What distinguishes a great leader from a merely competent one is the ability to inspire others during times of adversity.", hint:"distinguish...from・adversity", answers:["偉大なリーダーと単に有能なリーダーを区別するのは逆境の時に他者を鼓舞する能力です","優れたリーダーと単なる有能なリーダーの違いは困難な時期に他者を奮い立たせる能力にあります"], model:"偉大なリーダーと単に有能なリーダーを区別するのは、逆境の時に他者を鼓舞する能力です。", points:[{text:"distinguish A from B は「AとBを区別する」という表現です。"},{text:"adversity は「逆境、苦境」という意味の名詞です。"}], alternative:"真に卓越したリーダーとそれなりに優秀なリーダーとを分かつのは、困難な状況下においても人々を奮い立たせる力です。" },
      { id:"e-a-8", en:"The question is not whether technology will replace human workers, but how we can harness it to enhance human potential.", hint:"not whether...but how", answers:["問題はテクノロジーが人間の労働者に取って代わるかどうかではなく、人間の可能性を高めるためにいかに活用できるかです"], model:"問題は、テクノロジーが人間に取って代わるかどうかではなく、人間の可能性を高めるためにいかに活用するかです。", points:[{text:"not whether ... but how ... は「〜かどうかではなく、いかに〜か」という対比構造です。"},{text:"harness は「活用する、うまく利用する」という意味の動詞です。"}], alternative:"焦点は、AIが人間の仕事を奪うか否かではなく、人間の能力を拡張するためにどう活かすかにあります。" },
      { id:"e-a-9", en:"Unprecedented advances in artificial intelligence are compelling us to reconsider what it means to be human.", hint:"compelling・what it means", answers:["AIの急速な進歩は私たちに人間であることの意味を再考することを余儀なくさせています","人工知能の前例のない進歩が人間であることの意味を問い直すよう私たちに迫っています"], model:"AIの急速な進歩は、人間であることの意味を再考するよう私たちに迫っています。", points:[{text:"compel O to do は「Oに〜することを強いる」という表現です。"},{text:"what it means to be human は「人間であることの意味」という名詞節です。"}], alternative:"AIの飛躍的進歩は、「人間とは何か」という根源的な問いを私たちに突きつけています。" },
      { id:"e-a-10", en:"The rapid diffusion of misinformation through social media poses a serious threat to democratic discourse.", hint:"diffusion・poses a threat", answers:["ソーシャルメディアを通じた誤情報の急速な拡散は民主的な言論に深刻な脅威をもたらしています","SNSを通じた偽情報の急速な拡散は民主主義的な議論に深刻な脅威を与えています"], model:"ソーシャルメディアを通じた誤情報の急速な拡散は、民主的な言論に深刻な脅威をもたらしています。", points:[{text:"diffusion は「拡散、普及」という意味の名詞です。"},{text:"pose a threat to ... は「〜に脅威をもたらす」という慣用表現です。"}], alternative:"SNS上における虚偽情報の急速な蔓延は、民主主義的な言論空間を根底から脅かしています。" },
    ],
  },
  free: {
    beginner: [
      { id:"f-b-1", jp:"あなたの趣味について教えてください。", hint:"2〜3文で書いてみよう", checkFn:"free", model:"My hobby is reading books. I read at least one book a month. I especially enjoy mystery novels.", points:[{text:"My hobby is ... または I enjoy ... でシンプルに始めましょう。"},{text:"「特に〜が好き」は I especially like/enjoy ... で表現できます。"}], alternative:"One of my hobbies is photography. I love capturing everyday moments and sharing them with friends." },
      { id:"f-b-2", jp:"好きな食べ物とその理由を書いてください。", hint:"理由をbecauseで表現", checkFn:"free", model:"My favorite food is sushi because it is both delicious and healthy.", points:[{text:"My favorite food is ... because ... の構文で理由まで一文で書けます。"},{text:"理由を追加するときは also や moreover で文をつなぎましょう。"}], alternative:"I love ramen above all other foods, not only for its rich flavor but also for the comforting warmth it provides." },
    ],
    intermediate: [
      { id:"f-i-1", jp:"「リモートワーク」の長所と短所を述べてください。", hint:"比較・対比の構成で", checkFn:"free", model:"Remote work offers several advantages, such as flexibility and reduced commuting time. However, it also has drawbacks, including feelings of isolation.", points:[{text:"長所・短所を述べるには One advantage is ... / On the other hand, ... の構造が効果的です。"},{text:"「しかしながら」は However, や That said, を使いましょう。"}], alternative:"While remote work grants employees greater autonomy and eliminates the daily commute, it can blur the boundary between professional and personal life." },
      { id:"f-i-2", jp:"SNSが人間関係に与える影響について書いてください。", hint:"具体例を交えて3〜4文", checkFn:"free", model:"Social media has both positive and negative effects on human relationships. On one hand, it helps people stay connected. On the other hand, excessive use can lead to shallow interactions.", points:[{text:"「SNS」は social media または social networking sites と書きます。"},{text:"On one hand ... / On the other hand ... で対比構造を作ると説得力が増します。"}], alternative:"Social media platforms, while enabling global connectivity, may paradoxically deepen loneliness by replacing meaningful face-to-face interaction." },
    ],
    advanced: [
      { id:"f-a-1", jp:"少子化問題に対して政府が取るべき施策を論じてください。", hint:"主張・根拠・反論への対応", checkFn:"free", model:"To address the declining birthrate, governments should implement comprehensive policies including financial subsidies for childcare, expanded parental leave, and affordable housing.", points:[{text:"「少子化」は declining birthrate または falling birth rate です。"},{text:"反論への対処は Critics may argue ... ; however, ... の形が有効です。"}], alternative:"Governments must adopt a multifaceted approach—combining generous childcare subsidies, flexible working policies, and robust housing support." },
      { id:"f-a-2", jp:"AIの普及が雇用市場に与える長期的影響を考察してください。", hint:"経済・社会的視点から多角的に", checkFn:"free", model:"The widespread adoption of AI is likely to reshape the labor market significantly. While automation may displace certain routine jobs, it also has the potential to create new roles.", points:[{text:"「雇用市場」は labor market または job market です。"},{text:"While ... , it also ... の構文で両面を示すと議論が深まります。"}], alternative:"As AI permeates industries at an unprecedented pace, policymakers must balance the efficiency gains of automation against the imperative to protect and retrain a displaced workforce." },
    ],
  },
};

// ════════════════════════════════════════════════════════════
// 採点ロジック
// ════════════════════════════════════════════════════════════
function gradeAnswer(question, userAnswer) {
  const ua = userAnswer.toLowerCase().replace(/[.,!?'"。、！？]/g,"").trim();
  if (question.checkFn === "free") {
    const words = ua.split(/\s+/).filter(Boolean).length;
    const hasConnector = /because|since|therefore|however|although|while|moreover|furthermore/.test(ua);
    const sentences = (userAnswer.match(/[.!?。]/g)||[]).length;
    let s = 50;
    if (words>=20) s+=15; if (words>=40) s+=10;
    if (hasConnector) s+=10; if (sentences>=2) s+=15;
    return { score: Math.min(s,95), correct: s>=75 };
  }
  let best = 0;
  for (const ans of (question.answers||[])) {
    const norm = ans.toLowerCase().replace(/[.,!?'"。、！？]/g,"").trim();
    if (ua===norm) return { score:96, correct:true };
    const uaW = new Set(ua.split(/\s+/).filter(Boolean));
    const ansW = new Set(norm.split(/\s+/).filter(Boolean));
    const common = [...uaW].filter(w=>ansW.has(w)).length;
    const sim = (2*common)/(uaW.size+ansW.size);
    const s = Math.round(40+sim*56);
    if (s>best) best=s;
  }
  return { score:Math.min(best,95), correct: best>=75 };
}
function getLabel(s){ return s>=85?"Excellent":s>=65?"Good":"Needs Work"; }

// ════════════════════════════════════════════════════════════
// localStorage（window.storageの代わり）
// ════════════════════════════════════════════════════════════
const STORAGE_KEY = "lexis-mistakes-v1";

function loadMistakes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveMistakes(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ════════════════════════════════════════════════════════════
// CSS（lexis-v3 と同一）
// ════════════════════════════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0d1b3e;--panel:rgba(255,255,255,0.07);--panel2:rgba(255,255,255,0.04);--border:rgba(140,185,255,0.18);--border2:rgba(140,185,255,0.32);--blue:#4f8ef7;--blue-l:#7eb3ff;--blue-ll:#b8d4ff;--cyan:#38e8ff;--gold:#fbbf24;--green:#34d399;--red:#f87171;--orange:#fb923c;--txt:#ddeaff;--txt2:#93b4e0;--txt3:#5a7aaa;--shadow:0 8px 32px rgba(0,0,30,0.35)}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh}
.bg-grad{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 70% -10%,rgba(79,142,247,0.18) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at -10% 80%,rgba(56,232,255,0.1) 0%,transparent 60%)}
.bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.4;background-image:linear-gradient(rgba(79,142,247,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,0.07) 1px,transparent 1px);background-size:52px 52px}
.app{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:60px;background:rgba(13,27,62,0.88);border-bottom:1px solid var(--border);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100}
.logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;display:flex;align-items:center;gap:10px}
.logo-mark{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;font-weight:800;box-shadow:0 0 16px rgba(79,142,247,0.55)}
.hdr-back{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--panel);color:var(--txt2);font-family:'Syne',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
.hdr-back:hover{background:var(--panel2);color:var(--txt);border-color:var(--border2)}
.hdr-info{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--txt3);display:flex;gap:8px;align-items:center}
.hdr-chip{padding:3px 10px;border-radius:6px;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;background:rgba(79,142,247,0.15);color:var(--blue-l);border:1px solid rgba(79,142,247,0.25)}
.start{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;gap:36px}
.start-hero{text-align:center}
.start-logo-big{width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;margin:0 auto 20px;box-shadow:0 0 32px rgba(79,142,247,0.5),0 0 80px rgba(79,142,247,0.15)}
.start-title{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:10px}
.start-sub{font-size:15px;color:var(--txt2);line-height:1.6;max-width:360px;margin:0 auto}
.start-form{width:100%;max-width:500px;display:flex;flex-direction:column;gap:22px}
.sel-group{display:flex;flex-direction:column;gap:10px}
.sel-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);padding-left:2px}
.sel-cards{display:flex;gap:8px}
.sel-card{flex:1;padding:14px 10px;border-radius:14px;border:1.5px solid var(--border);background:var(--panel);cursor:pointer;transition:all .22s;text-align:center;position:relative;overflow:hidden}
.sel-card:hover{border-color:var(--border2);background:rgba(255,255,255,0.09)}
.sel-card.on{border-color:var(--blue);background:rgba(79,142,247,0.14);box-shadow:0 0 20px rgba(79,142,247,0.2)}
.sel-card.on::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),var(--cyan))}
.sel-card-icon{font-size:20px;margin-bottom:6px}
.sel-card-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-bottom:3px}
.sel-card-desc{font-size:10px;color:var(--txt3);line-height:1.4}
.review-btn{padding:14px;border-radius:14px;border:1px solid var(--border2);background:rgba(251,191,36,0.08);color:var(--gold);font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:10px}
.review-btn:hover{background:rgba(251,191,36,0.15);transform:translateY(-1px)}
.review-btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.start-btn{padding:15px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--blue),#2563eb);color:#fff;font-family:'Syne',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 0 24px rgba(79,142,247,0.35),inset 0 1px 0 rgba(255,255,255,.12)}
.start-btn:hover{transform:translateY(-2px);box-shadow:0 4px 32px rgba(79,142,247,0.5)}
.mistake-count{font-size:12px;color:var(--gold);font-family:'JetBrains Mono',monospace;text-align:center}
.main{max-width:660px;width:100%;margin:0 auto;padding:32px 20px 80px;display:flex;flex-direction:column;gap:18px}
.progress-wrap{display:flex;flex-direction:column;gap:6px}
.progress-bar-bg{height:4px;background:rgba(140,185,255,0.1);border-radius:2px;overflow:hidden}
.progress-bar-fill{height:100%;background:linear-gradient(90deg,var(--blue),var(--cyan));border-radius:2px;transition:width .4s ease}
.progress-label{display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--txt3)}
.qcard{background:var(--panel);border:1px solid var(--border2);border-radius:18px;padding:26px 28px;backdrop-filter:blur(12px);position:relative;overflow:hidden;box-shadow:var(--shadow),inset 0 1px 0 rgba(255,255,255,.05)}
.qcard-top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),var(--cyan))}
.qmeta{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.chip{padding:3px 10px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.chip-b{background:rgba(79,142,247,.15);color:var(--blue-l);border:1px solid rgba(79,142,247,.25)}
.chip-c{background:rgba(56,232,255,.1);color:var(--cyan);border:1px solid rgba(56,232,255,.2)}
.chip-o{background:rgba(251,146,60,.12);color:var(--orange);border:1px solid rgba(251,146,60,.25)}
.chip-rev{background:rgba(251,191,36,.12);color:var(--gold);border:1px solid rgba(251,191,36,.25)}
.qnum{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--txt3);margin-left:auto}
.qen{font-size:19px;font-weight:500;line-height:1.6;color:#fff;margin-bottom:10px;font-style:italic}
.qjp{font-family:'Syne',sans-serif;font-size:20px;font-weight:600;line-height:1.55;color:#fff;margin-bottom:10px}
.hint{font-size:13px;color:var(--txt3);display:flex;align-items:center;gap:6px}
.hint::before{content:'›';color:var(--blue-l);font-size:16px}
.input-lbl{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--txt3);margin-bottom:8px}
.ta{width:100%;min-height:110px;padding:15px 17px;background:var(--panel2);border:1px solid var(--border);border-radius:14px;color:var(--txt);font-family:'DM Sans',sans-serif;font-size:16px;line-height:1.65;resize:vertical;outline:none;transition:border-color .2s,box-shadow .2s}
.ta::placeholder{color:var(--txt3);font-style:italic}
.ta:focus{border-color:rgba(79,142,247,.55);box-shadow:0 0 0 3px rgba(79,142,247,.12)}
.ta:disabled{opacity:.55}
.btn-row{display:flex;gap:10px;align-items:center;margin-top:10px}
.btn-p{padding:13px 26px;background:linear-gradient(135deg,var(--blue),#2563eb);color:#fff;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 0 18px rgba(79,142,247,.3),inset 0 1px 0 rgba(255,255,255,.12)}
.btn-p:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 28px rgba(79,142,247,.5)}
.btn-p:disabled{opacity:.4;cursor:not-allowed}
.btn-s{padding:13px 18px;background:transparent;color:var(--txt3);border:1px solid var(--border);border-radius:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-s:hover{border-color:var(--border2);color:var(--txt2)}
.btn-n{width:100%;padding:14px;margin-top:4px;background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 0 18px rgba(5,150,105,.25),inset 0 1px 0 rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;gap:8px}
.btn-n:hover{transform:translateY(-1px);box-shadow:0 0 28px rgba(5,150,105,.4)}
.fb{border:1px solid var(--border2);border-radius:18px;overflow:hidden;backdrop-filter:blur(12px);box-shadow:var(--shadow);animation:slideUp .38s cubic-bezier(.16,1,.3,1)}
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.fb-hdr{padding:18px 22px;display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--border)}
.fb-hdr.excellent{background:linear-gradient(135deg,rgba(52,211,153,.14),rgba(5,150,105,.08))}
.fb-hdr.good{background:linear-gradient(135deg,rgba(79,142,247,.14),rgba(37,99,235,.08))}
.fb-hdr.needs-work{background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(245,158,11,.06))}
.fb-label{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:#fff}
.fb-sub{font-size:11px;color:var(--txt3);margin-top:2px;font-family:'JetBrains Mono',monospace}
.fb-score{margin-left:auto;text-align:center;font-family:'JetBrains Mono',monospace}
.fb-score-num{font-size:30px;font-weight:500;color:#fff;line-height:1}
.fb-score-den{font-size:12px;color:var(--txt3)}
.fb-body{background:var(--panel);padding:22px;display:flex;flex-direction:column;gap:20px}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--txt3);margin-bottom:9px;display:flex;align-items:center;gap:8px}
.sec-lbl::before{content:'';flex:0 0 16px;height:1px;background:var(--border2)}
.model-ans{font-size:16px;line-height:1.7;color:var(--green);font-weight:500;padding:13px 16px;background:rgba(52,211,153,.09);border-radius:11px;border:1px solid rgba(52,211,153,.2);border-left:3px solid var(--green)}
.pts{display:flex;flex-direction:column;gap:8px}
.point{display:flex;gap:11px;align-items:flex-start;font-size:14px;line-height:1.65;color:var(--txt2);padding:11px 14px;background:var(--panel2);border-radius:10px;border:1px solid var(--border)}
.alt{font-size:15px;line-height:1.7;color:var(--blue-ll);font-style:italic;padding:13px 16px;background:rgba(79,142,247,.09);border-radius:11px;border:1px solid rgba(79,142,247,.2);border-left:3px solid var(--blue)}
.result{max-width:660px;width:100%;margin:0 auto;padding:32px 20px 80px;display:flex;flex-direction:column;gap:20px;animation:slideUp .4s cubic-bezier(.16,1,.3,1)}
.result-hero{text-align:center;padding:32px 24px;background:var(--panel);border:1px solid var(--border2);border-radius:20px;position:relative;overflow:hidden}
.result-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--blue),var(--cyan),var(--green))}
.result-grade{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--txt3);margin-bottom:8px}
.result-score-big{font-family:'JetBrains Mono',monospace;font-size:72px;font-weight:500;color:#fff;line-height:1}
.result-score-den{font-size:18px;color:var(--txt3)}
.result-label{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-top:8px;margin-bottom:16px}
.result-label.excellent{color:var(--green)}.result-label.good{color:var(--blue-l)}.result-label.needs-work{color:var(--gold)}
.result-row{display:flex;gap:12px;justify-content:center}
.result-pill{padding:6px 16px;border-radius:20px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500}
.pill-green{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.2)}
.pill-red{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.2)}
.result-section{background:var(--panel);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.result-section-hdr{padding:14px 18px;border-bottom:1px solid var(--border);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.result-section-body{padding:16px 18px;display:flex;flex-direction:column;gap:10px}
.result-q-item{padding:12px 14px;border-radius:10px;border:1px solid var(--border);display:flex;gap:12px;align-items:flex-start}
.result-q-item.correct{background:rgba(52,211,153,.05);border-color:rgba(52,211,153,.2)}
.result-q-item.wrong{background:rgba(248,113,113,.05);border-color:rgba(248,113,113,.2)}
.result-q-text{font-size:14px;color:var(--txt2);line-height:1.5}
.result-q-model{font-size:13px;color:var(--green);margin-top:4px;font-style:italic}
.task-item{padding:10px 14px;border-radius:10px;background:var(--panel2);border:1px solid var(--border);font-size:14px;color:var(--txt2);line-height:1.6;display:flex;gap:10px;align-items:flex-start}
.result-btns{display:flex;flex-direction:column;gap:10px}
.btn-result-primary{padding:15px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--blue),#2563eb);color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 0 20px rgba(79,142,247,.3)}
.btn-result-primary:hover{transform:translateY(-1px);box-shadow:0 4px 28px rgba(79,142,247,.45)}
.btn-result-sec{padding:14px;border-radius:14px;border:1px solid var(--border2);background:transparent;color:var(--txt2);font-family:'Syne',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-result-sec:hover{background:var(--panel);color:var(--txt)}
.ring{position:relative;width:52px;height:52px}
.ring svg{transform:rotate(-90deg)}
.ring-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:var(--txt)}
.arc-e{stroke:var(--green)}.arc-g{stroke:var(--blue-l)}.arc-n{stroke:var(--gold)}
`;

// ════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════
function Ring({ score }) {
  const r=22,c=26,circ=2*Math.PI*r;
  const cls=score>=85?"arc-e":score>=65?"arc-g":"arc-n";
  return (
    <div className="ring">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(140,185,255,0.12)" strokeWidth="3.5"/>
        <circle cx={c} cy={c} r={r} fill="none" strokeWidth="3.5" className={cls}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"
          style={{transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div className="ring-num">{score}</div>
    </div>
  );
}

const LEVELS=[{id:"beginner",icon:"🌱",title:"初級",desc:"中学〜高校基礎レベル"},{id:"intermediate",icon:"📘",title:"中級",desc:"TOEIC 600〜800相当"},{id:"advanced",icon:"🎓",title:"上級",desc:"ビジネス・TOEIC 800+"}];
const MODES=[{id:"translation",icon:"🔄",title:"和文英訳",desc:"日本語→英語に翻訳する"},{id:"enja",icon:"📖",title:"英文和訳",desc:"英語→日本語に翻訳する"},{id:"free",icon:"✍️",title:"自由英作文",desc:"テーマに沿って自由に書く"}];
const SESSION_SIZE=10;

// ════════════════════════════════════════════════════════════
// Result Screen
// ════════════════════════════════════════════════════════════
function ResultScreen({ results, level, mode, onRetry, onMenu, onReview }) {
  const total=results.length;
  const correctCount=results.filter(r=>r.correct).length;
  const avgScore=Math.round(results.reduce((s,r)=>s+r.score,0)/total);
  const wrong=results.filter(r=>!r.correct);
  const scoreLabel=avgScore>=85?"excellent":avgScore>=65?"good":"needs-work";
  const labelText=avgScore>=85?"Excellent!":avgScore>=65?"Good Job!":"Keep Practicing";
  const lvlLabel=level==="beginner"?"初級":level==="intermediate"?"中級":"上級";
  const modeLabel=mode==="translation"?"和文英訳":mode==="enja"?"英文和訳":"自由英作文";
  const tasks=[];
  if(wrong.length>0) tasks.push(`間違えた${wrong.length}問を中心に復習しましょう。`);
  if(results.filter(r=>r.score<65).length>0) tasks.push("スコアが低い問題の解説ポイントを読み直すと効果的です。");
  if(avgScore>=85) tasks.push("素晴らしい成績です！上のレベルにも挑戦してみましょう。");
  else if(avgScore>=65) tasks.push("基本は定着しています。より難しい問題に挑戦しましょう。");

  return (
    <>
      <header className="hdr">
        <div className="logo"><div className="logo-mark">L</div>Lexis</div>
        <div className="hdr-info"><span className="hdr-chip">{lvlLabel}</span><span className="hdr-chip">{modeLabel}</span></div>
        <button className="hdr-back" onClick={onMenu}>← メニュー</button>
      </header>
      <div className="result">
        <div className="result-hero">
          <div className="result-grade">10問セッション完了</div>
          <div><span className="result-score-big">{avgScore}</span><span className="result-score-den"> / 100</span></div>
          <div className={`result-label ${scoreLabel}`}>{labelText}</div>
          <div className="result-row">
            <span className="result-pill pill-green">✓ 正解 {correctCount}問</span>
            <span className="result-pill pill-red">✗ 要復習 {total-correctCount}問</span>
          </div>
        </div>
        <div className="result-section">
          <div className="result-section-hdr">📋 問題別結果</div>
          <div className="result-section-body">
            {results.map((r,i)=>(
              <div key={i} className={`result-q-item ${r.correct?"correct":"wrong"}`}>
                <span style={{fontSize:16,flexShrink:0}}>{r.correct?"✅":"❌"}</span>
                <div style={{flex:1}}>
                  <div className="result-q-text">Q{i+1}. {mode==="enja"?`"${r.question.en}"`:r.question.jp}</div>
                  {!r.correct&&<div className="result-q-model">模範解答: {r.question.model}</div>}
                  <div style={{fontSize:12,color:"var(--txt3)",marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>スコア: {r.score}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {tasks.length>0&&(
          <div className="result-section">
            <div className="result-section-hdr">🎯 今後の課題</div>
            <div className="result-section-body">
              {tasks.map((t,i)=><div key={i} className="task-item"><span style={{flexShrink:0}}>›</span><span>{t}</span></div>)}
            </div>
          </div>
        )}
        <div className="result-btns">
          {wrong.length>0&&<button className="btn-result-primary" style={{background:"linear-gradient(135deg,#d97706,#b45309)"}} onClick={onReview}>🔁 間違えた{wrong.length}問を今すぐ復習</button>}
          <button className="btn-result-primary" onClick={onRetry}>もう一度同じコースに挑戦</button>
          <button className="btn-result-sec" onClick={onMenu}>メニューに戻る</button>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// Quiz Screen
// ════════════════════════════════════════════════════════════
function QuizScreen({ level, mode, onBack, onFinish, reviewQuestions }) {
  const allQs=reviewQuestions||QUESTIONS[mode]?.[level]||[];
  const qs=allQs.slice(0,SESSION_SIZE);
  const isReview=!!reviewQuestions;
  const [qIdx,setQIdx]=useState(0);
  const [answer,setAnswer]=useState("");
  const [feedback,setFeedback]=useState(null);
  const [results,setResults]=useState([]);
  const taRef=useRef(null);
  const q=qs[qIdx]||qs[0];

  const finished=feedback===null&&qIdx>=qs.length;
  useEffect(()=>{
    if(finished&&results.length>0){
      const mistakes=loadMistakes();
      results.forEach(r=>{
        const key=r.question.id;
        if(!r.correct){
          mistakes[key]={q:r.question,mode,level,missCount:(mistakes[key]?.missCount||0)+1,lastMissed:Date.now()};
        } else {
          delete mistakes[key];
        }
      });
      saveMistakes(mistakes);
      onFinish(results);
    }
  },[finished]);

  const submit=()=>{
    if(!answer.trim()) return;
    const{score,correct}=gradeAnswer(q,answer);
    setFeedback({score,label:getLabel(score),correct});
    setResults(prev=>[...prev,{question:q,score,correct,userAnswer:answer}]);
  };
  const next=()=>{ setQIdx(i=>i+1); setAnswer(""); setFeedback(null); setTimeout(()=>taRef.current?.focus(),80); };
  if(!q) return null;

  const cls=!feedback?"":feedback.score>=85?"excellent":feedback.score>=65?"good":"needs-work";
  const lvlLabel=level==="beginner"?"初級":level==="intermediate"?"中級":"上級";
  const modeLabel=mode==="translation"?"和文英訳":mode==="enja"?"英文和訳":"自由英作文";
  const chipCls=isReview?"chip chip-rev":mode==="enja"?"chip chip-o":"chip chip-b";
  const progressPct=Math.round((qIdx/qs.length)*100);

  return (
    <>
      <header className="hdr">
        <div className="logo"><div className="logo-mark">L</div>Lexis</div>
        <div className="hdr-info">
          {isReview&&<span className="hdr-chip" style={{color:"var(--gold)"}}>復習</span>}
          <span className="hdr-chip">{lvlLabel}</span><span className="hdr-chip">{modeLabel}</span>
        </div>
        <button className="hdr-back" onClick={onBack}>← メニュー</button>
      </header>
      <main className="main">
        <div className="progress-wrap">
          <div className="progress-label"><span>Q {qIdx+1} / {qs.length}</span><span>{progressPct}%</span></div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${progressPct}%`}}/></div>
        </div>
        <div className="qcard">
          <div className="qcard-top"/>
          <div className="qmeta">
            <span className={chipCls}>{isReview?"復習":modeLabel}</span>
            <span className="chip chip-c">{lvlLabel}</span>
            <span className="qnum">Q {qIdx+1} / {qs.length}</span>
          </div>
          {mode==="enja"?<div className="qen">"{q.en}"</div>:<div className="qjp">{q.jp}</div>}
          {q.hint&&<div className="hint">{q.hint}</div>}
        </div>
        <div>
          <div className="input-lbl">{mode==="enja"?"あなたの和訳を入力":"Your Answer in English"}</div>
          <textarea ref={taRef} className="ta" value={answer} onChange={e=>setAnswer(e.target.value)}
            placeholder={mode==="enja"?"日本語で翻訳を書いてください...":"Write your English answer here..."}
            disabled={!!feedback} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")submit();}}/>
          {!feedback&&(
            <div className="btn-row">
              <button className="btn-p" onClick={submit} disabled={!answer.trim()}>採点する →</button>
              <button className="btn-s" onClick={next}>スキップ</button>
              <span style={{marginLeft:"auto",fontSize:11,color:"var(--txt3)",fontFamily:"'JetBrains Mono',monospace"}}>⌘↵</span>
            </div>
          )}
        </div>
        {feedback&&(
          <div className="fb">
            <div className={`fb-hdr ${cls}`}>
              <Ring score={feedback.score}/>
              <div><div className="fb-label">{feedback.label}</div><div className="fb-sub">採点結果</div></div>
              <div className="fb-score" style={{marginLeft:"auto"}}><div className="fb-score-num">{feedback.score}</div><div className="fb-score-den">/ 100</div></div>
            </div>
            <div className="fb-body">
              <div><div className="sec-lbl">模範解答</div><div className="model-ans">{q.model}</div></div>
              <div>
                <div className="sec-lbl">解説ポイント</div>
                <div className="pts">{q.points.map((p,i)=><div key={i} className="point"><span style={{fontSize:15,flexShrink:0}}>💡</span><span>{p.text}</span></div>)}</div>
              </div>
              {q.alternative&&<div><div className="sec-lbl">より自然な表現</div><div className="alt">{q.alternative}</div></div>}
              {qIdx<qs.length-1
                ?<button className="btn-n" onClick={next}>次の問題へ →</button>
                :<button className="btn-n" style={{background:"linear-gradient(135deg,#7c3aed,#5b21b6)"}} onClick={next}>結果を見る →</button>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// Start Screen
// ════════════════════════════════════════════════════════════
function StartScreen({ onStart, onStartReview, mistakeCount }) {
  const [level,setLevel]=useState("intermediate");
  const [mode,setMode]=useState("translation");
  return (
    <div className="start">
      <div className="start-hero">
        <div className="start-logo-big">L</div>
        <div className="start-title">Lexis</div>
        <div className="start-sub">語彙と表現力を磨く、本格英作文トレーニング。<br/>レベルとコースを選んで始めましょう。</div>
      </div>
      <div className="start-form">
        <div className="sel-group">
          <div className="sel-label">難易度を選択</div>
          <div className="sel-cards">{LEVELS.map(l=><div key={l.id} className={`sel-card${level===l.id?" on":""}`} onClick={()=>setLevel(l.id)}><div className="sel-card-icon">{l.icon}</div><div className="sel-card-title">{l.title}</div><div className="sel-card-desc">{l.desc}</div></div>)}</div>
        </div>
        <div className="sel-group">
          <div className="sel-label">コースを選択</div>
          <div className="sel-cards">{MODES.map(m=><div key={m.id} className={`sel-card${mode===m.id?" on":""}`} onClick={()=>setMode(m.id)}><div className="sel-card-icon">{m.icon}</div><div className="sel-card-title">{m.title}</div><div className="sel-card-desc">{m.desc}</div></div>)}</div>
        </div>
        <button className="start-btn" onClick={()=>onStart(level,mode)}>スタート →</button>
        <button className="review-btn" onClick={onStartReview} disabled={mistakeCount===0}>🔁 復習モード {mistakeCount>0?`(${mistakeCount}問)`:""}</button>
        {mistakeCount===0?<div className="mistake-count">復習問題はまだありません</div>:<div className="mistake-count">過去に間違えた {mistakeCount}問 が復習キューにあります</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Root App
// ════════════════════════════════════════════════════════════
export default function App() {
  const [screen,setScreen]=useState("start");
  const [level,setLevel]=useState("intermediate");
  const [mode,setMode]=useState("translation");
  const [results,setResults]=useState([]);
  const [mistakes,setMistakes]=useState({});
  const [reviewQs,setReviewQs]=useState(null);

  useEffect(()=>{ setMistakes(loadMistakes()); },[]);

  const mistakeCount=Object.keys(mistakes).length;

  const handleStart=(lv,mo)=>{ setLevel(lv);setMode(mo);setReviewQs(null);setScreen("quiz"); };

  const handleStartReview=()=>{
    const m=loadMistakes();
    setMistakes(m);
    const sorted=Object.values(m).sort((a,b)=>(b.missCount||1)-(a.missCount||1)).slice(0,SESSION_SIZE);
    if(sorted.length===0) return;
    const qs=sorted.map(item=>item.q);
    setMode(sorted[0].mode||"translation");
    setLevel(sorted[0].level||"intermediate");
    setReviewQs(qs);
    setScreen("quiz");
  };

  const handleFinish=(res)=>{ setResults(res);setScreen("result");setMistakes(loadMistakes()); };
  const handleRetry=()=>{ setReviewQs(null);setScreen("quiz"); };
  const handleReviewFromResult=()=>{
    const wrongQs=results.filter(r=>!r.correct).map(r=>r.question);
    if(wrongQs.length===0) return;
    setReviewQs(wrongQs);setScreen("quiz");
  };
  const handleMenu=()=>{ setScreen("start");setReviewQs(null);setMistakes(loadMistakes()); };

  return (
    <>
      <style>{css}</style>
      <div className="bg-grad"/><div className="bg-grid"/>
      <div className="app">
        {screen==="start"&&<><header className="hdr"><div className="logo"><div className="logo-mark">L</div>Lexis</div></header><StartScreen onStart={handleStart} onStartReview={handleStartReview} mistakeCount={mistakeCount}/></>}
        {screen==="quiz"&&<QuizScreen level={level} mode={mode} onBack={handleMenu} onFinish={handleFinish} reviewQuestions={reviewQs}/>}
        {screen==="result"&&<ResultScreen results={results} level={level} mode={mode} onRetry={handleRetry} onMenu={handleMenu} onReview={handleReviewFromResult}/>}
      </div>
    </>
  );
}
