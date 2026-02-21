import type { Scenario } from '../../types';

export const ilSerious: Scenario[] = [
  // ===== SERIOUS 1: イラン核施設への極秘作戦 =====
  {
    scenario_title_ja: 'イラン核施設への極秘作戦',
    scenario_title_en: 'Covert Operation Against Iran\'s Nuclear Facility',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、モサドの最新情報ではイランの核開発が最終段階に入った。残された時間は6ヶ月だ。', en: 'Fixer, according to the latest Mossad intelligence, Iran\'s nuclear program has entered its final stage. We have six months.' },
      { speaker: 'fixer', ja: '首相、イランのナタンズ施設の遠心分離機が稼働率を倍増させています。しかし、軍事攻撃は最後の手段です。その前に試すべきオプションがあります。', en: 'Prime Minister, centrifuges at Iran\'s Natanz facility have doubled their operating rate. However, a military strike is the last resort. There are options to try first.' },
      { speaker: 'leader', ja: 'サイバー攻撃か？スタックスネットのような？', en: 'A cyber attack? Like Stuxnet?' },
      { speaker: 'fixer', ja: 'スタックスネットの進化版です。今回は遠心分離機を破壊するのではなく、「正常に稼働しているように見せかけながら濃縮度を下げる」ウイルスです。イランは異常に気づかないまま、核兵器級のウランを得られなくなります。', en: 'An evolved version of Stuxnet. This time, instead of destroying centrifuges, it\'s a virus that "makes them appear to operate normally while reducing enrichment levels." Iran won\'t notice the anomaly but will be unable to produce weapons-grade uranium.' },
      { speaker: 'leader', ja: 'アメリカの協力は得られるか？', en: 'Can we get American cooperation?' },
      { speaker: 'fixer', ja: 'NSAとの共同作業が不可欠です。すでに技術レベルでの協力は始まっています。ただし、ホワイトハウスへの正式な報告は「事後」にします。大統領が知らなければ、否認権を維持できます。', en: 'NSA collaboration is essential. Technical cooperation has already begun. However, the formal report to the White House will come "after the fact." If the President doesn\'t know, plausible deniability is maintained.' },
      { speaker: 'leader', ja: 'イランに発覚した場合のリスクは？', en: 'What\'s the risk if Iran discovers it?' },
      { speaker: 'fixer', ja: '発覚しても、我々が関与した証拠は残りません。ウイルスは自動消去機能を持っています。万が一の場合でも、イランは「自国の技術的失敗」と発表するでしょう。プライドが真実を隠してくれます。', en: 'Even if discovered, no evidence of our involvement remains. The virus has an auto-delete function. Even in the worst case, Iran will announce it as "a domestic technical failure." Their pride will conceal the truth.' },
      { speaker: 'leader', ja: 'イスラエルの存続がかかっている。確実に成功させろ。', en: 'Israel\'s survival is at stake. Make this succeed.' },
      { speaker: 'fixer', ja: '首相、イスラエルは常に存続の危機を乗り越えてきました。今回も例外ではありません。作戦開始は来週の火曜日。コードネームは「ダビデの石」です。', en: 'Prime Minister, Israel has always overcome existential threats. This time is no exception. Operation begins next Tuesday. Codename: "David\'s Stone."' },
    ],
  },
  // ===== SERIOUS 2: アラブ諸国との秘密正常化交渉 =====
  {
    scenario_title_ja: 'アラブ諸国との秘密正常化交渉',
    scenario_title_en: 'Secret Normalization Talks with Arab States',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、サウジアラビアからの秘密特使が来週テルアビブに到着するという情報は確かか。', en: 'Fixer, is the intel confirmed that a secret Saudi envoy will arrive in Tel Aviv next week?' },
      { speaker: 'fixer', ja: '確実です。サウジの皇太子が直接派遣する側近です。議題は「国交正常化のロードマップ」。アブラハム合意以来、最大の外交的進展になります。', en: 'Confirmed. A close aide dispatched directly by the Saudi Crown Prince. The agenda: "Roadmap for Normalization." This would be the biggest diplomatic breakthrough since the Abraham Accords.' },
      { speaker: 'leader', ja: 'サウジが今になって動く理由は何だ？', en: 'Why is Saudi Arabia moving now?' },
      { speaker: 'fixer', ja: 'イランの脅威です。サウジにとってイランは存在的脅威であり、イスラエルの情報力と軍事技術が欲しいのです。「敵の敵は味方」という古典的な構図です。', en: 'The Iranian threat. For Saudi Arabia, Iran is an existential threat, and they want Israel\'s intelligence capabilities and military technology. The classic "enemy of my enemy is my friend."' },
      { speaker: 'leader', ja: 'パレスチナ問題が障壁になるだろう。サウジ国内のイスラム聖職者が反対する。', en: 'The Palestinian issue will be a barrier. Saudi clerics will oppose it.' },
      { speaker: 'fixer', ja: 'そこが交渉のポイントです。サウジに「パレスチナ国家承認への段階的ロードマップ」を提示します。実行するかは別として、「姿勢を見せる」ことがサウジの国内向けに必要なのです。', en: 'That\'s the negotiation\'s key point. We present Saudi Arabia with a "phased roadmap toward Palestinian statehood recognition." Whether we execute it is another matter — "showing the posture" is what Saudi needs domestically.' },
      { speaker: 'leader', ja: '我が党の右派が黙っていないぞ。パレスチナへの譲歩は…。', en: 'Our party\'s right wing won\'t stay silent. Concessions to Palestine...' },
      { speaker: 'fixer', ja: '「ロードマップ」は「地図」であり「目的地」ではありません。方向性を示すだけで、到着義務はありません。外交的曖昧さこそが最大の武器です。', en: 'A "roadmap" is a "map," not a "destination." It shows direction without obligation to arrive. Diplomatic ambiguity is our greatest weapon.' },
      { speaker: 'leader', ja: 'サウジとの正常化が実現すれば、中東全体が変わる。', en: 'If normalization with Saudi Arabia is achieved, the entire Middle East changes.' },
      { speaker: 'fixer', ja: 'その通りです。ドミノ効果で5カ国以上が続くと見ています。首相、千年の対立を超える一歩を、我々の世代で踏み出しましょう。', en: 'Exactly. I project a domino effect with five or more countries following. Prime Minister, let our generation take the step that transcends a thousand years of conflict.' },
    ],
  },
  // ===== SERIOUS 3: モサドの裏切り者 =====
  {
    scenario_title_ja: 'モサドの裏切り者',
    scenario_title_en: 'The Mossad Traitor',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、モサドの内部に裏切り者がいる。過去2件の作戦が事前に敵に漏洩していた。', en: 'Fixer, there\'s a traitor inside Mossad. Intelligence from the last two operations was leaked to the enemy in advance.' },
      { speaker: 'fixer', ja: '首相、私も独自に調査を進めていました。裏切り者は現場のエージェントではありません。本部の分析官です。最も疑いにくいポジションにいる人物です。', en: 'Prime Minister, I\'ve been conducting my own investigation. The traitor isn\'t a field agent. It\'s an analyst at headquarters. The person in the least suspicious position.' },
      { speaker: 'leader', ja: '証拠はあるのか？', en: 'Do you have proof?' },
      { speaker: 'fixer', ja: '状況証拠は揃っています。直接証拠を得るために「蜜壺作戦」を仕掛けます。偽の作戦計画を裏切り者だけがアクセスできるデータベースに入れ、敵の反応を監視します。', en: 'Circumstantial evidence is in place. To obtain direct proof, I\'ll execute a "honey pot operation." We place a fake operation plan in a database only the traitor can access and monitor the enemy\'s response.' },
      { speaker: 'leader', ja: '裏切りの動機は金か？イデオロギーか？', en: 'Is the motive money? Ideology?' },
      { speaker: 'fixer', ja: '金です。彼の口座に定期的に不明な入金があります。タックスヘイブン経由ですが、最終的な資金源はイランの革命防衛隊に繋がっています。', en: 'Money. His account receives regular unexplained deposits. Routed through tax havens, but the ultimate funding source traces back to Iran\'s Revolutionary Guard.' },
      { speaker: 'leader', ja: 'イランか…。逮捕して公開裁判にかけるべきではないか。', en: 'Iran... Shouldn\'t we arrest him and hold a public trial?' },
      { speaker: 'fixer', ja: '公開裁判はモサドの信頼を損ないます。静かに処理し、同時に彼を通じてイランに偽情報を流します。裏切り者を逆スパイとして利用するのです。最後に、彼には「自主退職」してもらいます。', en: 'A public trial would damage Mossad\'s credibility. We handle it quietly while simultaneously feeding disinformation to Iran through him. We use the traitor as a reverse spy. Finally, he\'ll "voluntarily resign."' },
      { speaker: 'leader', ja: 'イランが彼の裏切りに気づいたら？', en: 'What if Iran realizes he\'s been turned?' },
      { speaker: 'fixer', ja: 'イランにとって「自分たちのスパイが二重スパイだった」と認めることは、彼ら自身の諜報の失敗を意味します。沈黙が彼らの唯一の選択肢です。首相、情報戦では、相手のプライドが最大の味方です。', en: 'For Iran, admitting "our spy was a double agent" would mean acknowledging their own intelligence failure. Silence is their only option. Prime Minister, in intelligence warfare, the enemy\'s pride is our greatest ally.' },
    ],
  },
];

export const ilComedy: Scenario[] = [
  // ===== COMEDY 1: 死海の水位低下でリゾート計画が頓挫 =====
  {
    scenario_title_ja: '死海の水位低下でリゾート計画が頓挫',
    scenario_title_en: 'Dead Sea Water Level Drop Ruins the Resort Plan',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、死海のリゾート開発計画が問題に直面している。水位が下がりすぎて、ビーチリゾートが内陸になってしまった。', en: 'Fixer, the Dead Sea resort development project is in trouble. The water level has dropped so much that the beach resort is now inland.' },
      { speaker: 'fixer', ja: '首相、正確には、リゾートから海岸線まで500メートルの荒野が広がっています。宿泊客は「海が見えない」と苦情を言っています。', en: 'Prime Minister, to be precise, there\'s 500 meters of barren land between the resort and the shoreline. Guests are complaining they "can\'t see the sea."' },
      { speaker: 'leader', ja: '5年前に建設した時は海沿いだったのに…。水位低下のスピードが予想以上だ。', en: 'It was beachfront when we built it five years ago... The rate of water level decline is worse than expected.' },
      { speaker: 'fixer', ja: '年間1メートルのペースで後退しています。しかし対策案があります。「死海マラソン」を新設します。宿泊客がビーチまで走るコースを設定し、「世界一低い場所でのマラソン」として観光PRに転換します。', en: 'It\'s receding at one meter per year. But I have a plan. We create a "Dead Sea Marathon." Set up a course for guests to run to the beach, marketed as "the world\'s lowest-altitude marathon" for tourism PR.' },
      { speaker: 'leader', ja: 'リゾート客にマラソンさせるのか…。', en: 'Making resort guests run a marathon...' },
      { speaker: 'fixer', ja: '加えて、「浮遊体験」の代わりに「泥パック・スパ」を拡充します。死海の泥は美容効果で世界的に有名です。海に入れなくても、泥があれば十分です。', en: 'Additionally, instead of "floating experiences," we expand "mud pack spa" services. Dead Sea mud is world-famous for beauty benefits. Even without the sea, the mud is enough.' },
      { speaker: 'leader', ja: 'ヨルダン側との水位問題は解決できるのか？', en: 'Can we resolve the water level issue with Jordan?' },
      { speaker: 'fixer', ja: '紅海からパイプラインで海水を引くプロジェクトをヨルダンと共同で進めています。「死海を救う」プロジェクトとして国際的な投資も集めています。死海が完全に干上がる前に…間に合わせます。', en: 'We\'re advancing a joint project with Jordan to pipe seawater from the Red Sea. As a "Save the Dead Sea" project, we\'re attracting international investment. Before the Dead Sea completely dries up... we\'ll make it in time.' },
      { speaker: 'leader', ja: '…死海が本当になくなったら、名前はどうする？', en: '...If the Dead Sea really disappears, what do we call it?' },
      { speaker: 'fixer', ja: '「死んだ海のあった場所（Dead Sea Memorial Park）」として世界遺産に登録しましょう。首相、イスラエルは砂漠を緑に変えた国です。死海も蘇らせます。', en: 'We register "Dead Sea Memorial Park" as a World Heritage Site. Prime Minister, Israel is the nation that turned desert green. We\'ll resurrect the Dead Sea too.' },
    ],
  },
  // ===== COMEDY 2: 鉄のドームが打ち落としたのはドローン配達 =====
  {
    scenario_title_ja: '鉄のドームが打ち落としたのはドローン配達',
    scenario_title_en: 'Iron Dome Shoots Down a Delivery Drone',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、鉄のドームが発動して飛翔体を撃墜したという報告があったが…。', en: 'Fixer, I received a report that the Iron Dome activated and shot down an aerial object, but...' },
      { speaker: 'fixer', ja: '首相、撃墜したのは…Amazonの配達ドローンでした。テルアビブ在住の市民に届けるはずだったピザメーカーです。', en: 'Prime Minister, what was shot down was... an Amazon delivery drone. It was delivering a pizza maker to a citizen in Tel Aviv.' },
      { speaker: 'leader', ja: 'ピザメーカーを100万ドルのミサイルで撃墜したのか…。', en: 'We shot down a pizza maker with a million-dollar missile...' },
      { speaker: 'fixer', ja: '正確にはタミルミサイル1発、推定費用5万ドルです。ドローンの配送品の価格は39.99ドルでした。コスト比は1250対1です。', en: 'To be precise, one Tamir interceptor missile, estimated cost $50,000. The drone\'s cargo was worth $39.99. The cost ratio is 1,250 to 1.' },
      { speaker: 'leader', ja: 'なぜ鉄のドームが反応したんだ？', en: 'Why did Iron Dome react?' },
      { speaker: 'fixer', ja: 'ドローンの飛行パターンがロケット弾の弾道と一致してしまったようです。AIが「脅威」と判定しました。技術的にはAIは正しく動作していますが…常識的には問題です。', en: 'The drone\'s flight pattern apparently matched a rocket\'s trajectory. The AI classified it as a "threat." Technically the AI functioned correctly, but... common sense says otherwise.' },
      { speaker: 'leader', ja: 'Amazonへの賠償は？国際問題にならないか？', en: 'What about compensation to Amazon? Won\'t this become an international issue?' },
      { speaker: 'fixer', ja: 'Amazonには「鉄のドームの性能実証に協力いただいた」として感謝状と新品のドローンを贈呈します。さらに「イスラエルの防空システムは配達ドローンすら見逃さない」とPRに転換します。', en: 'We present Amazon with a certificate of appreciation for "cooperating in demonstrating Iron Dome\'s capabilities" along with a replacement drone. Then we spin it as PR: "Israel\'s air defense doesn\'t miss even a delivery drone."' },
      { speaker: 'leader', ja: 'ピザメーカーを注文した市民はどうする？', en: 'What about the citizen who ordered the pizza maker?' },
      { speaker: 'fixer', ja: '「鉄のドームの犠牲者第一号」として国防省から最高級のピザメーカーとイスラエル国旗をお届けします。次回からは…配達ドローンの飛行ルートを国防省に事前申請するシステムを構築します。', en: 'As "the first civilian casualty of the Iron Dome," the Ministry of Defense will deliver a premium pizza maker and an Israeli flag. Going forward... we\'ll build a system requiring delivery drones to pre-register flight routes with the Defense Ministry.' },
    ],
  },
  // ===== COMEDY 3: 首相の母のレシピがモサドの暗号に =====
  {
    scenario_title_ja: '首相の母のレシピがモサドの暗号に',
    scenario_title_en: 'The PM\'s Mother\'s Recipe Becomes a Mossad Code',
    lines: [
      { speaker: 'leader', ja: 'フィクサー、母から苦情の電話が来た。「私のファラフェルのレシピが国家機密にされた」と怒っている。', en: 'Fixer, I got a complaint call from my mother. She\'s furious that "my falafel recipe has been classified as a state secret."' },
      { speaker: 'fixer', ja: '首相、説明させてください。お母様のレシピの調合比率が、偶然にもモサドの新暗号体系と完全に一致したのです。「ひよこ豆200g＝作戦開始」「パセリ3束＝撤退」という具合に。', en: 'Prime Minister, let me explain. Your mother\'s recipe ratios accidentally aligned perfectly with Mossad\'s new cipher system. "200g chickpeas = operation go," "3 bunches parsley = retreat," and so on.' },
      { speaker: 'leader', ja: '母の料理が暗号だと？彼女は70年間同じレシピで作っているだけなのに！', en: 'My mother\'s cooking is a cipher? She\'s just been using the same recipe for 70 years!' },
      { speaker: 'fixer', ja: 'だからこそ完璧なのです。70年間変わらないレシピは、暗号としての一貫性があります。敵国には「ただのレシピ」にしか見えません。しかもお母様のファラフェルは美味しいので、諜報員のモチベーションも上がります。', en: 'That\'s exactly why it\'s perfect. A recipe unchanged for 70 years has cipher consistency. To enemy nations, it looks like "just a recipe." Plus, your mother\'s falafel is delicious, so it boosts agent morale.' },
      { speaker: 'leader', ja: '母はレシピを親戚全員に配っているんだぞ。セキュリティ上問題ないのか？', en: 'My mother shares the recipe with all our relatives. Isn\'t that a security issue?' },
      { speaker: 'fixer', ja: '親戚の方々にはすでにセキュリティクリアランスを…冗談です。レシピ自体は問題ありません。暗号化のルールは別に管理されています。レシピを見ただけでは解読不可能です。', en: 'Your relatives have already been granted security clearance... Just kidding. The recipe itself isn\'t the issue. The encryption rules are managed separately. The recipe alone can\'t be decoded.' },
      { speaker: 'leader', ja: '母が「モサドに著作権料を請求する」と言っているんだが…。', en: 'My mother says she\'s going to "charge Mossad royalties"...' },
      { speaker: 'fixer', ja: 'お母様には「国家安全保障特別功労賞」を授与しましょう。そして毎週金曜日、お母様のファラフェルをモサド本部に納品する契約を結びます。月額報酬は…国家機密です。', en: 'Let\'s award your mother the "National Security Special Merit Medal." And establish a contract for her to deliver falafel to Mossad headquarters every Friday. The monthly compensation is... classified.' },
      { speaker: 'leader', ja: '…母が喜ぶ姿が目に浮かぶ。モサドのためにファラフェルを作る母か。', en: '...I can picture my mother\'s joy. My mother, making falafel for Mossad.' },
      { speaker: 'fixer', ja: '首相、歴史上最も美味しいスパイ活動です。なお来週のテヘラン作戦の暗号は「クミン小さじ2」です。お母様に感謝を。', en: 'Prime Minister, this is the most delicious espionage in history. The code for next week\'s Tehran operation is "2 teaspoons cumin." Give your mother our thanks.' },
    ],
  },
];
