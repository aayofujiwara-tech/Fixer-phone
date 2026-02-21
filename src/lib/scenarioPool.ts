// シナリオプール（事前生成済み台本）
import type { Scenario } from '../types';

interface ScenarioPool {
  serious: Scenario[];
  comedy: Scenario[];
}

// 国ごとのシナリオプール（現在はアメリカのみ）
const scenarioPools: Record<string, ScenarioPool> = {
  us: {
    serious: [
      // ===== SERIOUS 1: 極秘停戦交渉 =====
      {
        scenario_title_ja: '極秘停戦交渉',
        scenario_title_en: 'Secret Ceasefire Negotiation',
        lines: [
          { speaker: 'leader', ja: 'フィクサー、状況は最悪だ。72時間以内に停戦合意に至らなければ、全面衝突は避けられない。', en: 'Fixer, the situation is dire. If we don\'t reach a ceasefire agreement within 72 hours, a full-scale conflict is inevitable.' },
          { speaker: 'fixer', ja: '閣下、すでにジュネーブの特使と水面下で接触済みです。相手方も交渉の席に着く準備があります。', en: 'Mr. President, I have already made contact with the Geneva envoy behind the scenes. The other side is prepared to come to the table.' },
          { speaker: 'leader', ja: '国防総省は強硬策を主張している。議会の圧力もある。私の立場は非常に厳しい。', en: 'The Pentagon is pushing for a hard-line approach. There\'s congressional pressure too. My position is extremely difficult.' },
          { speaker: 'fixer', ja: '強硬派を抑える材料は用意してあります。衛星画像の解析データを国防長官に提示すれば、72時間の猶予は確保できます。', en: 'I have prepared material to contain the hawks. If we present the satellite imagery analysis to the Secretary of Defense, we can secure a 72-hour window.' },
          { speaker: 'leader', ja: '相手方の条件は何だ？何を要求してきている？', en: 'What are their conditions? What are they demanding?' },
          { speaker: 'fixer', ja: '経済制裁の段階的緩和と、国境地帯の非武装化です。想定の範囲内です。カウンターオファーの草案はすでに完成しています。', en: 'A phased easing of economic sanctions and demilitarization of the border zone. Within our expectations. The counter-offer draft is already complete.' },
          { speaker: 'leader', ja: '…君はいつも一歩先を行くな。わかった、全権を委任する。ただし、一つ条件がある。すべての記録を残すな。', en: '...You\'re always one step ahead. Alright, I\'m giving you full authority. But one condition — leave no records of any of this.' },
          { speaker: 'fixer', ja: 'ご心配なく。この通話も含め、すべて24時間後には消去されます。閣下、歴史は我々の味方です。', en: 'Rest assured. Everything, including this call, will be erased in 24 hours. Mr. President, history is on our side.' },
          { speaker: 'leader', ja: '頼んだぞ。この件が成功すれば、世界は変わる。', en: 'I\'m counting on you. If this succeeds, it will change the world.' },
          { speaker: 'fixer', ja: '「変える」のではありません。「すでに変わり始めている」のです。次の報告は12時間後に。', en: 'We won\'t "change" it — it has already begun to change. I\'ll report back in 12 hours.' },
        ],
      },
      // ===== SERIOUS 2: サイバー攻撃危機 =====
      {
        scenario_title_ja: 'サイバー攻撃危機',
        scenario_title_en: 'Cyber Attack Crisis',
        lines: [
          { speaker: 'leader', ja: '東海岸の送電網が落ちた。NSAは国家レベルのサイバー攻撃だと断定した。', en: 'The East Coast power grid is down. The NSA has confirmed it\'s a state-level cyber attack.' },
          { speaker: 'fixer', ja: '30分前に情報を掴みました。攻撃元のIPは偽装されていますが、真の発信源は特定済みです。', en: 'I got the intel 30 minutes ago. The source IPs are spoofed, but I\'ve already identified the true origin.' },
          { speaker: 'leader', ja: '報復攻撃を求める声が上がっている。サイバー軍司令官は即座の反撃を進言してきた。', en: 'There are calls for a retaliatory strike. The Cyber Command chief is advising an immediate counter-attack.' },
          { speaker: 'fixer', ja: '反撃は罠です。相手はそれを望んでいる。エスカレーションを誘発して、同盟関係に亀裂を入れるのが真の目的です。', en: 'Retaliation is a trap. That\'s exactly what they want. Their true objective is to provoke escalation and fracture our alliances.' },
          { speaker: 'leader', ja: 'では、どうすればいい？国民は停電に苦しんでいる。何もしないわけにはいかない。', en: 'Then what do we do? Citizens are suffering from the blackout. We can\'t just do nothing.' },
          { speaker: 'fixer', ja: '表向きは復旧作業に全力を注ぎます。裏では、相手国の金融システムに静かにアクセスするバックドアをすでに確保してあります。', en: 'Publicly, we focus all efforts on restoration. Behind the scenes, I\'ve already secured a backdoor into their financial systems.' },
          { speaker: 'leader', ja: '…それは使えるカードだな。交渉の武器になる。', en: '...That\'s a card we can play. It could be a powerful bargaining chip.' },
          { speaker: 'fixer', ja: 'はい。「我々は知っている」と伝えるだけで、相手は撤退せざるを得ません。報復ではなく、抑止です。', en: 'Yes. Simply letting them know "we know" will force their withdrawal. It\'s not retaliation — it\'s deterrence.' },
          { speaker: 'leader', ja: '見事だ。実行に移してくれ。ただし、この件は副大統領にも知らせるな。', en: 'Brilliant. Execute it. But don\'t inform even the Vice President about this.' },
          { speaker: 'fixer', ja: '了解しました。送電網は6時間以内に復旧させます。そして明朝、相手方から「友好的な提案」が届くでしょう。', en: 'Understood. The power grid will be restored within 6 hours. And by tomorrow morning, you\'ll receive a "friendly proposal" from the other side.' },
        ],
      },
      // ===== SERIOUS 3: 核密約の再交渉 =====
      {
        scenario_title_ja: '核密約の再交渉',
        scenario_title_en: 'Secret Nuclear Treaty Renegotiation',
        lines: [
          { speaker: 'leader', ja: '20年前の核密約の存在がリークされかけている。ワシントン・ポストが嗅ぎつけた。', en: 'The existence of the nuclear secret treaty from 20 years ago is about to be leaked. The Washington Post is onto it.' },
          { speaker: 'fixer', ja: '記者の名前と情報源は把握しています。ただし、記事を潰すのは得策ではありません。', en: 'I have the reporter\'s name and their source. However, killing the story would not be wise.' },
          { speaker: 'leader', ja: 'なぜだ？あの密約が公になれば、政権は持たない。', en: 'Why not? If that treaty becomes public, my administration won\'t survive.' },
          { speaker: 'fixer', ja: '記事を潰せば、かえって注目を集めます。代わりに、密約を「進化」させるのです。現行の条約に組み込む形で合法化します。', en: 'Suppressing the story will only draw more attention. Instead, we "evolve" the treaty. We legitimize it by incorporating it into the current framework.' },
          { speaker: 'leader', ja: '相手国が同意するとは思えない。彼らにとってもリスクがある。', en: 'I don\'t see the other side agreeing. It\'s a risk for them too.' },
          { speaker: 'fixer', ja: '彼らも困っています。こちらと同じリークの危険にさらされている。共通の利益があるからこそ、今がチャンスです。', en: 'They\'re in trouble too. They face the same leak risk. Because we share a common interest, now is our window of opportunity.' },
          { speaker: 'leader', ja: '記者への対応はどうする？', en: 'What about the reporter?' },
          { speaker: 'fixer', ja: '独占インタビューを餌にします。「新たな軍縮合意」として報じさせれば、スクープの価値は維持しつつ、ナラティブを我々がコントロールできます。', en: 'We dangle an exclusive interview. If we frame it as a "new disarmament agreement," the reporter keeps their scoop while we control the narrative.' },
          { speaker: 'leader', ja: 'スキャンダルを功績に変えるわけか…。恐ろしい男だな、君は。', en: 'Turning a scandal into an achievement... You\'re a terrifying man.' },
          { speaker: 'fixer', ja: '褒め言葉として受け取っておきます。署名式は来月のG7に合わせましょう。舞台は私が整えます。', en: 'I\'ll take that as a compliment. Let\'s time the signing ceremony with next month\'s G7. I\'ll set the stage.' },
        ],
      },
    ],
    comedy: [
      // ===== COMEDY 1: 大統領のレシピ流出事件 =====
      {
        scenario_title_ja: '大統領の極秘レシピ流出事件',
        scenario_title_en: 'The Presidential Secret Recipe Leak',
        lines: [
          { speaker: 'leader', ja: 'フィクサー、大変だ！ホワイトハウスの極秘バーベキューソースのレシピが流出した！', en: 'Fixer, this is a disaster! The White House\'s top-secret BBQ sauce recipe has been leaked!' },
          { speaker: 'fixer', ja: '閣下、落ち着いてください。流出先は特定済みです。フランスの三ツ星シェフのInstagramです。', en: 'Mr. President, please calm down. I\'ve identified the leak destination. It\'s on a French three-star chef\'s Instagram.' },
          { speaker: 'leader', ja: 'あのレシピは歴代大統領が200年守り続けてきた国家機密だぞ！リンカーンの隠し味が世界に！', en: 'That recipe is a state secret that presidents have guarded for 200 years! Lincoln\'s secret ingredient is out there!' },
          { speaker: 'fixer', ja: 'ご安心を。流出したのはダミーレシピです。本物の隠し味…メープルシロップとワサビの配合比は無事です。', en: 'Rest easy. What leaked was the decoy recipe. The real secret — the maple syrup and wasabi ratio — is safe.' },
          { speaker: 'leader', ja: 'なぜダミーレシピが存在するんだ？', en: 'Why does a decoy recipe even exist?' },
          { speaker: 'fixer', ja: '前政権時代に私が仕込みました。こうなることは想定済みです。ダミーを試作したフランスのシェフは今頃「まずい」と頭を抱えているでしょう。', en: 'I planted it during the previous administration. I anticipated this scenario. The French chef who tried the decoy is probably holding his head in despair right now.' },
          { speaker: 'leader', ja: 'はは！あのフランス人め！…で、犯人は誰なんだ？', en: 'Ha! That French guy! ...So, who\'s the culprit?' },
          { speaker: 'fixer', ja: 'ファーストレディの料理教室の生徒です。潜入捜査官がすでに料理教室に参加しています。来週のテーマは「和食」です。', en: 'One of the First Lady\'s cooking class students. An undercover agent has already enrolled in the class. Next week\'s theme is "Japanese cuisine."' },
          { speaker: 'leader', ja: '…君は料理教室にまでエージェントを送り込んでいるのか。', en: '...You\'ve planted agents even in cooking classes?' },
          { speaker: 'fixer', ja: 'キッチンは第二の戦場です、閣下。来週の報告書には犯人の名前と…おすすめの出汁の取り方を添えておきます。', en: 'The kitchen is a second battlefield, Mr. President. Next week\'s report will include the culprit\'s name and... my recommended dashi stock technique.' },
        ],
      },
      // ===== COMEDY 2: 宇宙人の接待問題 =====
      {
        scenario_title_ja: '宇宙人の接待問題',
        scenario_title_en: 'The Alien Hospitality Crisis',
        lines: [
          { speaker: 'leader', ja: 'フィクサー、エリア51から緊急連絡だ。宇宙人が「おもてなし」に不満を持っているらしい。', en: 'Fixer, urgent message from Area 51. The aliens are apparently dissatisfied with our hospitality.' },
          { speaker: 'fixer', ja: 'はい、詳細は把握しています。彼らの不満は3点。Wi-Fiが遅い、食事がまずい、枕が硬い。', en: 'Yes, I have the details. Three complaints: slow Wi-Fi, bad food, and hard pillows.' },
          { speaker: 'leader', ja: '銀河系を超えてきた知的生命体がWi-Fiの速度に文句を言うのか…。', en: 'Beings who crossed the galaxy are complaining about Wi-Fi speed...' },
          { speaker: 'fixer', ja: '彼らの母星では光速の10倍の通信が標準です。エリア51の回線は彼らにとって「石器時代」だそうです。Starlinkの特別回線を手配しました。', en: 'Their home planet has standard communication at 10x light speed. Area 51\'s connection is "Stone Age" to them. I\'ve arranged a special Starlink line.' },
          { speaker: 'leader', ja: '食事の問題は？軍の食堂じゃダメだったか？', en: 'What about the food? The military cafeteria wasn\'t good enough?' },
          { speaker: 'fixer', ja: '彼らは光合成で栄養を得るので、食事というより「日光浴スペース」が必要でした。ネバダの砂漠にVIPサンベッドを設置済みです。', en: 'They photosynthesize for nutrition, so they need sunbathing space rather than food. I\'ve set up VIP sun beds in the Nevada desert.' },
          { speaker: 'leader', ja: '枕は？まさか枕も特注か？', en: 'The pillows? Don\'t tell me those need to be custom too?' },
          { speaker: 'fixer', ja: '彼らの頭部は直径80センチの球体です。NASAに低反発枕の特注を依頼しました。予算はNASAの「未分類研究費」から捻出します。', en: 'Their heads are 80-centimeter spheres. I\'ve commissioned NASA to make custom memory foam pillows. Budget comes from NASA\'s "unclassified research" fund.' },
          { speaker: 'leader', ja: '税金で宇宙人の枕を作ってるのか我々は…。で、彼らは満足するのか？', en: 'We\'re using taxpayer money to make alien pillows... Will they be satisfied?' },
          { speaker: 'fixer', ja: '満足どころか、Yelpに星5レビューを書くと言っています。「地球 - Wi-Fi以外は最高。再訪予定。」', en: 'More than satisfied. They said they\'ll write a 5-star Yelp review: "Earth - Great except for the Wi-Fi. Will visit again."' },
        ],
      },
      // ===== COMEDY 3: 大統領の猫が機密を握っている =====
      {
        scenario_title_ja: '大統領の猫が機密を握っている',
        scenario_title_en: 'The President\'s Cat Knows State Secrets',
        lines: [
          { speaker: 'leader', ja: 'フィクサー、信じられないことが起きた。うちの猫のミトンズが、核のフットボールの暗証番号を覚えたらしい。', en: 'Fixer, something unbelievable has happened. My cat Mittens apparently memorized the nuclear football codes.' },
          { speaker: 'fixer', ja: '…お気持ちはわかります。しかし閣下、猫が暗証番号を「覚えた」とは、具体的にどういう状況ですか？', en: '...I understand your concern. But Mr. President, what exactly do you mean the cat "memorized" the codes?' },
          { speaker: 'leader', ja: 'キーパッドの上を歩いた時に、偶然正しいコードを入力したんだ。2回連続で。シークレットサービスが青ざめている。', en: 'She walked across the keypad and accidentally entered the correct code. Twice in a row. The Secret Service went pale.' },
          { speaker: 'fixer', ja: '確率的にはほぼ不可能ですが…。まず暗証番号を即座に変更します。新しいコードは猫が歩けないパターンにしましょう。', en: 'Statistically near-impossible, but... First, we change the codes immediately. The new pattern will be one a cat can\'t walk.' },
          { speaker: 'leader', ja: '問題はそれだけじゃない。CIAの報告書によると、ミトンズは過去3回、機密ブリーフィング中にずっと部屋にいた。', en: 'That\'s not the only problem. According to CIA reports, Mittens was in the room during three classified briefings.' },
          { speaker: 'fixer', ja: 'ミトンズにセキュリティクリアランスを発行しましょう。前例がないわけではありません。冷戦時代にCIAはカラスを訓練していました。', en: 'Let\'s issue Mittens a security clearance. It\'s not without precedent. The CIA trained ravens during the Cold War.' },
          { speaker: 'leader', ja: '猫にトップシークレットの clearance を？議会に知られたら…', en: 'Top Secret clearance for a cat? If Congress finds out...' },
          { speaker: 'fixer', ja: '書類上は「特別顧問M」として処理します。ペンタゴンには猫好きが多いので、むしろ士気が上がるかもしれません。', en: 'On paper, she\'ll be processed as "Special Advisor M." There are many cat lovers at the Pentagon — it might actually boost morale.' },
          { speaker: 'leader', ja: '…この国は猫に国家機密を任せるのか。建国の父たちが泣いているぞ。', en: '...This nation is entrusting state secrets to a cat. The Founding Fathers are weeping.' },
          { speaker: 'fixer', ja: 'ご安心ください。ミトンズの忠誠心は疑う余地がありません。なにしろ、毎日閣下の膝の上で寝ていますから。次の問題は…ミトンズ専用のセキュリティバッジの写真撮影です。', en: 'Rest assured. Mittens\' loyalty is beyond question — after all, she sleeps on your lap every day. The next issue is... scheduling Mittens\' security badge photo.' },
        ],
      },
    ],
  },
};

/**
 * シナリオプールからランダムに1つ選択する
 * @param countryId 国ID（例: 'us'）
 * @param mood 'serious' | 'comedy'
 * @returns Scenario | null（該当国のプールがなければnull）
 */
export function getRandomScenario(countryId: string, mood: 'serious' | 'comedy'): Scenario | null {
  const pool = scenarioPools[countryId];
  if (!pool) return null;

  const scenarios = pool[mood];
  if (!scenarios || scenarios.length === 0) return null;

  const index = Math.floor(Math.random() * scenarios.length);
  return scenarios[index];
}

/**
 * 指定国のシナリオプールが存在するかチェック
 */
export function hasScenarioPool(countryId: string): boolean {
  return countryId in scenarioPools;
}
