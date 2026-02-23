import { useState, useCallback, useRef, useEffect } from 'react';

// ======================================================
// Web Speech API 日本語TTS 読み補正辞書
// 表示テキストには影響しない。TTS送信前に変換する。
// ======================================================

// 読み補正辞書（長い語から順に並べて部分一致の誤変換を防止）
const JA_READING_FIXES: [string, string][] = [
  // ===========================================
  // Phase 1: 敬称・VIP呼称・頻出政治用語
  // ===========================================
  // --- 敬称 ---
  ['閣下', 'かっか'],
  ['殿下', 'でんか'],
  ['聖下', 'せいか'],
  ['陛下', 'へいか'],
  // --- VIP呼称 ---
  ['国家主席', 'こっかしゅせき'],
  ['皇太子', 'こうたいし'],
  ['枢機卿', 'すうききょう'],
  ['教皇', 'きょうこう'],
  // --- 頻出政治用語 ---
  ['国防総省', 'こくぼうそうしょう'],
  ['支持率', 'しじりつ'],
  ['与党', 'よとう'],
  ['野党', 'やとう'],
  ['内閣', 'ないかく'],
  ['官邸', 'かんてい'],
  ['打診', 'だしん'],
  ['根回し', 'ねまわし'],
  ['水面下', 'すいめんか'],
  ['密約', 'みつやく'],

  // ===========================================
  // Phase 2: 国別の専門用語
  // ===========================================
  // --- 軍事・安全保障 ---
  ['人民解放軍', 'じんみんかいほうぐん'],
  ['空母打撃群', 'くうぼだげきぐん'],
  ['核抑止力', 'かくよくしりょく'],
  ['全面衝突', 'ぜんめんしょうとつ'],
  ['非武装化', 'ひぶそうか'],
  ['強硬派', 'きょうこうは'],
  ['停戦', 'ていせん'],
  ['制裁', 'せいさい'],
  ['報復', 'ほうふく'],
  ['抑止', 'よくし'],
  ['諜報', 'ちょうほう'],
  ['領空', 'りょうくう'],
  // --- 組織・機関 ---
  ['政治局常務委員会', 'せいじきょくじょうむいいんかい'],
  ['国防長官', 'こくぼうちょうかん'],
  ['宮内庁', 'くないちょう'],
  ['気象庁', 'きしょうちょう'],
  ['外務省', 'がいむしょう'],
  ['防衛省', 'ぼうえいしょう'],
  ['赤十字', 'せきじゅうじ'],
  ['統計局', 'とうけいきょく'],
  ['科技部', 'かぎぶ'],
  // --- 地名・固有名詞 ---
  ['清華大学', 'せいかだいがく'],
  ['京都御所', 'きょうとごしょ'],
  ['国交正常化', 'こっこうせいじょうか'],
  ['エリゼ宮', 'えりぜきゅう'],
  ['ルーヴル', 'るーゔる'],
  ['中科院', 'ちゅうかいん'],
  ['赤坂', 'あかさか'],
  ['箱根', 'はこね'],
  ['合肥', 'ごうひ'],
  ['平壌', 'ぴょんやん'],
  ['皇居', 'こうきょ'],
  // --- 外交・政治 ---
  ['経済制裁', 'けいざいせいさい'],
  ['人道回廊', 'じんどうかいろう'],
  ['超党派', 'ちょうとうは'],
  ['大義名分', 'たいぎめいぶん'],
  ['全権', 'ぜんけん'],

  // ===========================================
  // Phase 3: コメディ特有の語彙
  // ===========================================
  // --- 食・文化 ---
  ['晩餐会', 'ばんさんかい'],
  ['露天風呂', 'ろてんぶろ'],
  ['納豆', 'なっとう'],
  ['火鍋', 'ひなべ'],
  ['出汁', 'だし'],
  ['薬膳', 'やくぜん'],
  ['料亭', 'りょうてい'],
  // --- その他 ---
  ['低反発', 'ていはんぱつ'],
  ['柔道', 'じゅうどう'],
  ['声優', 'せいゆう'],
  ['温泉', 'おんせん'],
  ['行幸', 'ぎょうこう'],
  ['作揖', 'さくゆう'],
  ['潜入', 'せんにゅう'],
  ['特訓', 'とっくん'],

  // ===========================================
  // Phase 4: 全72シナリオ精査による追加
  // ===========================================

  // --- 人名・地名 ---
  ['金正恩', 'きむじょんうん'],            // 韓国語名; TTSは「きんせいおん」と読む
  ['板門店', 'はんもんてん'],              // 朝鮮半島DMZ地名
  ['青瓦台', 'せいがだい'],                // 韓国大統領府
  ['独島', 'どくとう'],                    // 韓国名の島; 「どくしま」と読まれがち
  ['竹島', 'たけしま'],                    // TTSが「ちくとう」と音読みする可能性
  ['内蒙古自治区', 'うちもうこじちく'],    // 「ないもうこ」と読まれがち
  ['広東省', 'かんとんしょう'],            // 「こうとうしょう」と読まれがち
  ['四川省', 'しせんしょう'],              // 中国省名
  ['軽井沢', 'かるいざわ'],               // 「けいいざわ」と読まれる可能性
  ['練馬区', 'ねりまく'],                  // 「れんばく」と読まれる可能性
  ['御用邸', 'ごようてい'],               // 皇室関連; 「おようてい」と読まれがち
  ['白樺', 'しらかば'],                    // 訓読み; 「はっかば」と読まれる可能性

  // --- 軍事・安全保障 ---
  ['一触即発', 'いっしょくそくはつ'],      // 四字熟語; TTSが分割誤りしがち
  ['第七艦隊', 'だいななかんたい'],        // 「しち」vs「なな」の曖昧性
  ['迎撃', 'げいげき'],                    // 「むかえうち」と読まれる可能性
  ['極超音速', 'ごくちょうおんそく'],      // 希少な接頭語結合
  ['遠心分離機', 'えんしんぶんりき'],      // 長い技術用語
  ['大陸棚延伸', 'たいりくだなえんしん'],  // 「棚」=「だな」の読み
  ['緩衝地帯', 'かんしょうちたい'],        // 分割誤りしがち
  ['実効支配', 'じっこうしはい'],          // 政治専門用語
  ['粛清', 'しゅくせい'],                  // 希少語; 読み誤り
  ['送電網', 'そうでんもう'],              // 技術用語
  ['軍縮', 'ぐんしゅく'],                  // 誤読リスク
  ['招聘', 'しょうへい'],                  // 「聘」が希少漢字
  ['供与', 'きょうよ'],                    // 音読み; 「ともよ」と読まれがち
  ['人工島', 'じんこうとう'],              // 「しま」ではなく「とう」
  ['弾頭', 'だんとう'],                    // 軍事用語
  ['濃縮度', 'のうしゅくど'],              // 技術用語
  ['参謀長', 'さんぼうちょう'],            // 軍事肩書き

  // --- 組織・機関名 ---
  ['国連安保理', 'こくれんあんぽり'],      // 略称; TTSが分割誤り
  ['地震予知連絡会', 'じしんよちれんらくかい'], // 長い組織名
  ['会計検査院', 'かいけいけんさいん'],    // 政府機関名
  ['対外治安総局', 'たいがいちあんそうきょく'], // フランスDGSE
  ['革命防衛隊', 'かくめいぼうえいたい'], // イラン軍事組織
  ['中国人民銀行', 'ちゅうごくじんみんぎんこう'], // 中国中央銀行
  ['連合王国', 'れんごうおうこく'],        // イギリス正式名称

  // --- 宗教・バチカン ---
  ['大司教', 'だいしきょう'],              // 大+司教の複合語
  ['司教', 'しきょう'],                    // 「ししょう」と読まれがち
  ['聖体拝領', 'せいたいはいりょう'],      // 宗教用語の四字複合
  ['告解', 'こっかい'],                    // 「国会」と同音; 読み間違い
  ['被造物', 'ひぞうぶつ'],               // 神学用語; 希少語
  ['福音宣教', 'ふくいんせんきょう'],      // 宗教複合語
  ['聖杯', 'せいはい'],                    // 宗教用語

  // --- 政治・外交 ---
  ['一帯一路', 'いったいいちろ'],          // 政策名; 分割誤り
  ['孫子', 'そんし'],                      // 「まごこ」と読まれる
  ['兵法', 'へいほう'],                    // 「ひょうほう」と読まれる可能性
  ['拉致', 'らち'],                        // 重要政治用語
  ['奪還', 'だっかん'],                    // 誤読リスク
  ['女将', 'おかみ'],                      // 不規則読み; TTSは「じょしょう」と読む
  ['冒涜', 'ぼうとく'],                    // 希少漢字
  ['蜃気楼', 'しんきろう'],               // 希少語
  ['画策', 'かくさく'],                    // 「がさく」と読まれがち
  ['刷新', 'さっしん'],                    // 「さつしん」と読まれがち
  ['捻出', 'ねんしゅつ'],                  // 希少な読み
  ['枯渇', 'こかつ'],                      // 希少漢字
  ['次官補', 'じかんほ'],                  // 官職名
  ['漁業協定', 'ぎょぎょうきょうてい'],    // 連続ギョ音
  ['不可侵条約', 'ふかしんじょうやく'],    // 長い複合語
  ['解党', 'かいとう'],                    // 「げとう」と読まれがち

  // --- 食・文化 ---
  ['麻辣', 'まーらー'],                    // 中華料理用語; 「まら」と読まれる
  ['泡菜', 'パオツァイ'],                  // 中国語; 「ほうさい」と読まれる
  ['般若心経', 'はんにゃしんぎょう'],      // 「般若」=「はんにゃ」不規則
  ['湯加減', 'ゆかげん'],                  // 「湯」=「ゆ」vs「とう」

  // --- その他 ---
  ['龍脳', 'りゅうのう'],                  // 「龍」の読み曖昧性
  ['三つ巴', 'みつどもえ'],               // 「巴」の不規則読み
  ['鳩舎', 'きゅうしゃ'],                  // 「はとしゃ」と読まれる

  // ===========================================
  // Phase 4b: 追加精査による補充
  // ===========================================

  // --- 軍事・技術・専門用語 ---
  ['大外刈り', 'おおそとがり'],            // 柔道技; 「だいがいかり」と読まれる
  ['飛翔体', 'ひしょうたい'],              // 軍事用語; 分割誤り
  ['封鎖', 'ふうさ'],                      // 「ふうとじ」と読まれる可能性
  ['迂回', 'うかい'],                      // 「うまわり」と読まれる可能性
  ['偽装', 'ぎそう'],                      // 「にせそう」と読まれる可能性
  ['海里', 'かいり'],                      // 海事単位; 「うみさと」と読まれる
  ['海抜', 'かいばつ'],                    // 「うみぬき」と読まれる可能性
  ['蜜壺作戦', 'みつつぼさくせん'],        // 諜報用語; 希少
  ['赤旗中断', 'あかはたちゅうだん'],      // F1用語; 「せっき」と読まれる
  ['浮体式', 'ふたいしき'],                // 技術用語; 希少
  ['在日米軍', 'ざいにちべいぐん'],        // 長い複合語
  ['南南協力', 'なんなんきょうりょく'],    // 外交用語; 分割誤り

  // --- 人名・複合語 ---
  ['独仏', 'どくふつ'],                    // 国名略称; 「どくほとけ」と読まれる
  ['日露', 'にちろ'],                      // 国名略称; 「ひろ」と読まれる可能性
  ['参院選', 'さんいんせん'],              // 略称; 分割誤り

  // --- 読み曖昧・希少語 ---
  ['亀裂', 'きれつ'],                      // 「かめれつ」と読まれる
  ['側近', 'そっきん'],                    // 「がわちか」と読まれる可能性
  ['麻痺', 'まひ'],                        // 「あさひ」と読まれる可能性
  ['拘留', 'こうりゅう'],                  // 「こうどめ」と読まれる可能性
  ['猶予', 'ゆうよ'],                      // 読み誤りの可能性
  ['先手', 'せんて'],                      // 「さきて」と読まれる可能性
  ['逆手', 'さかて'],                      // 「ぎゃくて」と読まれる
  ['三ツ星', 'みつぼし'],                  // 「さんつぼし」と読まれる

  // --- 食・文化・宗教 ---
  ['作法', 'さほう'],                      // 「さくほう」と読まれる可能性
  ['蓮華座', 'れんげざ'],                  // ヨガ用語; 分割誤り
  ['ひよこ豆', 'ひよこまめ'],              // 「ひよこず」と読まれる可能性
];

// 長い語から先に変換（「経済制裁」を「制裁」より先に処理）
const SORTED_FIXES = [...JA_READING_FIXES].sort((a, b) => b[0].length - a[0].length);

// 完全一致変換（部分文字列を安全に置換）
function fixJaReading(text: string): string {
  let fixed = text;
  for (const [word, reading] of SORTED_FIXES) {
    fixed = fixed.split(word).join(reading);
  }
  // 三点リーダー: 句読点の前なら削除、それ以外は短いポーズに変換
  fixed = fixed.replace(/[…。]{2,}|…[。！？]/g, (m) => m.replace(/…/g, ''));
  fixed = fixed.replace(/\.{3}[。！？]/g, (m) => m.slice(3));
  fixed = fixed.replace(/…/g, '、');
  fixed = fixed.replace(/\.{3}/g, '、');
  return fixed;
}

// ======================================================
// 男性音声選択（ブラウザ・OS別の優先順位リスト）
// ======================================================

// 既知の女性音声パターン（これらを確実に除外する）
const FEMALE_VOICE_PATTERNS =
  /female|kyoko|o-ren|haruka|samantha|karen|fiona|tessa|moira|victoria|zuzana|alice|amelie|anna|ellen|monica|luciana|milena|yelda|mei-jia|sin-ji/i;

// 既知の男性音声パターン（フォールバック判定用）
const MALE_VOICE_PATTERNS =
  /\bmale\b|otoya|takeru|keita|ichiro|ken(?!ya)|hattori|daniel|david|alex(?!a)|james|jorge|thomas|rishi|aaron|fred\b|ralph|junior/i;

// ブラウザ・OS別の男性音声優先リスト（上から順に優先）
// prettier-ignore
const JA_MALE_VOICE_PRIORITY = [
  // Safari / macOS / iOS
  'otoya',          // macOS 男性日本語
  'takeru',         // iOS 拡張男性日本語
  // Edge / Windows
  'keita',          // Microsoft Keita Online (Natural)
  'microsoft keita',
  // Chrome
  'google 日本語',   // Chrome built-in（性別不定だがピッチで補正）
  // Android
  'ja-jp-x-jab',    // Google TTS 男性系バリアント
  'ja-jp-x-jac',
];

// prettier-ignore
const EN_MALE_VOICE_PRIORITY = [
  // Safari / macOS / iOS
  'daniel',         // macOS/iOS British English 男性
  'alex',           // macOS 男性（高品質）
  'fred',           // macOS フォールバック男性
  'ralph',
  // Edge / Windows
  'microsoft guy',  // Edge Online (Natural)
  'microsoft mark',
  'guy',
  // Chrome
  'google us english',  // Chrome built-in
  // Android
  'en-us-x-sfg',   // Google TTS 男性系バリアント
];

function isKnownFemale(voice: SpeechSynthesisVoice): boolean {
  return FEMALE_VOICE_PATTERNS.test(voice.name);
}

function isKnownMale(voice: SpeechSynthesisVoice): boolean {
  return MALE_VOICE_PATTERNS.test(voice.name);
}

// 音声の性別判定ラベル
function genderLabel(voice: SpeechSynthesisVoice): string {
  if (isKnownFemale(voice)) return 'Female';
  if (isKnownMale(voice)) return 'Male';
  return 'Unknown';
}

// 指定言語の男性音声を取得（優先順位付き）
function findMaleVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(lang));
  const priorityList = lang === 'ja' ? JA_MALE_VOICE_PRIORITY : EN_MALE_VOICE_PRIORITY;

  let selectedVoice: SpeechSynthesisVoice | null = null;
  let selectionMethod = '';

  // Step 1: 優先リストから順に探す
  for (const name of priorityList) {
    const match = langVoices.find(
      v => v.name.toLowerCase().includes(name.toLowerCase()) && !isKnownFemale(v)
    );
    if (match) {
      selectedVoice = match;
      selectionMethod = 'priority match';
      break;
    }
  }

  // Step 2: 名前パターンで男性と判定できる音声
  if (!selectedVoice) {
    const knownMale = langVoices.find(v => isKnownMale(v) && !isKnownFemale(v));
    if (knownMale) {
      selectedVoice = knownMale;
      selectionMethod = 'pattern match';
    }
  }

  // Step 3: 女性と判定されない最初の音声（ピッチで補正）
  if (!selectedVoice) {
    const nonFemale = langVoices.find(v => !isKnownFemale(v));
    if (nonFemale) {
      selectedVoice = nonFemale;
      selectionMethod = 'non-female fallback';
    }
  }

  // Step 4: どうしても見つからない場合は最初の音声
  if (!selectedVoice && langVoices.length > 0) {
    selectedVoice = langVoices[0];
    selectionMethod = 'last-resort fallback';
  }

  // --- 音声診断ログ ---
  if (import.meta.env.DEV) {
    const langLabel = lang === 'ja' ? 'JA' : 'EN';
    console.group(`[TTS] Available ${langLabel} voices:`);
    langVoices.forEach((v, i) => {
      const gender = genderLabel(v);
      const isSelected = v === selectedVoice;
      const mark = isSelected ? ' (selected)' : '';
      const icon = isKnownFemale(v) ? '\u2717' : isKnownMale(v) ? '\u2713' : '?';
      console.log(`  ${i + 1}. "${v.name}" [${v.lang}] \u2192 ${gender} ${icon}${mark}`);
    });
    if (selectedVoice) {
      console.log(`\u2501 Result: "${selectedVoice.name}" via ${selectionMethod}`);
    } else {
      console.log('\u2501 Result: No voice available');
    }
    console.groupEnd();
  }

  return selectedVoice;
}

// ======================================================
// iOS 判定・デバッグログ
// ======================================================

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

function getPlatformLabel(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  if (/iPhone/.test(navigator.userAgent)) return 'iPhone';
  if (/iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iPad';
  if (/Android/.test(navigator.userAgent)) return 'Android';
  return 'other';
}

// デバッグオーバーレイ用のイベントログ（モジュールレベル）
export const _ttsDebugLog: { time: number; msg: string }[] = [];
export function _isTtsUnlocked() { return _iosUnlocked; }
export function _getPlatformInfo() {
  return {
    label: getPlatformLabel(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    cancelDelay: isIOS() ? IOS_CANCEL_SPEAK_DELAY : isAndroid() ? ANDROID_CANCEL_SPEAK_DELAY : 0,
  };
}

function ttsLog(message: string, ...args: unknown[]) {
  console.log(`[TTS] ${message}`, ...args);
  _ttsDebugLog.push({ time: Date.now(), msg: message });
  if (_ttsDebugLog.length > 50) _ttsDebugLog.shift();
}

// ======================================================
// iOS speechSynthesis サイレントアンロック
// iOS Safari では最初のユーザージェスチャーで speechSynthesis を
// 「アンロック」しないと、以降の speak() が無音になる。
// ======================================================

let _iosUnlocked = false;
let _iosUnlockSetup = false;

function setupIOSUnlock() {
  if (!isIOS()) return;
  if (_iosUnlocked) return;
  if (_iosUnlockSetup) return;           // 重複登録を防止
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  _iosUnlockSetup = true;

  const unlock = () => {
    if (_iosUnlocked) return;

    // ── iOS Safari オーディオセッション有効化 ──
    // iOS Safari はユーザージェスチャー1回につき speechSynthesis への
    // "特権呼出し" を1回だけ認める。cancel()/resume() を先に呼ぶと
    // ジェスチャー権限を消費してしまい speak() がアンロックとして機能しない。
    // → speak() をジェスチャー内の **最初の** speechSynthesis 呼出しにする。
    // → 直後に cancel() で発声を止め無音にする（セッション有効化は speak() 時点で完了）。
    const utterance = new SpeechSynthesisUtterance('.');
    utterance.volume = 0;           // cancel が遅れた場合の保険
    utterance.onend = () => ttsLog('Unlock utterance: onend fired');
    utterance.onerror = (e) => ttsLog(`Unlock utterance: onerror ${e.error}`);

    window.speechSynthesis.speak(utterance);
    // speak() 呼出し時点でオーディオセッションは有効化される。即座に cancel。
    window.speechSynthesis.cancel();
    _iosUnlocked = true;

    const s = window.speechSynthesis;
    ttsLog(`Speech unlock: activated (speak+cancel)`);
    ttsLog(`Synth post-unlock: speaking=${s.speaking} pending=${s.pending} paused=${s.paused}`);

    // 一度だけ実行
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
  };

  document.addEventListener('touchstart', unlock, { once: true, passive: true });
  document.addEventListener('click', unlock, { once: true });
  ttsLog('Speech unlock: listener registered');
}

// モジュールロード時にアンロックリスナーを登録。
// CallScreen マウントを待たず、SetupScreen でのユーザー操作（国選択・ボタン押下等）で
// speechSynthesis をアンロックする。これにより CallScreen の最初の speak() が動作する。
setupIOSUnlock();

// ======================================================
// iOS 安全な speak（cancel→遅延→speak）
// iOS Safari では cancel() 直後の speak() が無音になるバグがある。
// 200ms の遅延を入れて回避する。
// ======================================================

const IOS_CANCEL_SPEAK_DELAY = 200;
// Android Chrome でも cancel() 直後の speak() が無音になるケースがある。
// iOS より軽度だが安全のため短い遅延を入れる。
const ANDROID_CANCEL_SPEAK_DELAY = 50;

// TTS制御フック
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const volumeRef = useRef(1.0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const speakDelayTimerRef = useRef<number | null>(null);

  // ブラウザがTTSに対応しているか
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // iOS: 初回マウント時にアンロックリスナーを設置
  useEffect(() => {
    if (!isSupported) return;
    setupIOSUnlock();
  }, [isSupported]);

  // 音声リストは非同期で読み込まれるため、イベントを監視
  useEffect(() => {
    if (!isSupported) return;

    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
      ttsLog(`Voices available: ${window.speechSynthesis.getVoices().length} voices`);
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // 既に読み込み済みの場合
    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      setVoicesLoaded(true);
      ttsLog(`Voices available: ${currentVoices.length} voices (immediate)`);
    } else {
      ttsLog('Voices available: 0 (waiting for voiceschanged)');
    }

    // iOS: voiceschanged が発火しない場合の保険（500ms後に再チェック）
    let fallbackTimer: number | undefined;
    if (isIOS()) {
      fallbackTimer = window.setTimeout(() => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0 && !voicesLoaded) {
          setVoicesLoaded(true);
          ttsLog(`Voices available: ${v.length} voices (iOS fallback)`);
        }
      }, 500);
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  // プラットフォーム情報のログ（初回のみ）
  useEffect(() => {
    if (!isSupported) return;
    ttsLog(`Platform: ${getPlatformLabel()}`);
    ttsLog(`Speech unlock: ${_iosUnlocked ? 'success' : 'pending'}`);
  }, [isSupported]);

  // 音量設定（0.0〜1.0）
  const setVolume = useCallback((vol: number) => {
    volumeRef.current = Math.max(0, Math.min(1, vol));
  }, []);

  // 読み上げ停止
  const stop = useCallback(() => {
    if (isSupported) {
      // 遅延speakタイマーが残っていたらクリア
      if (speakDelayTimerRef.current !== null) {
        clearTimeout(speakDelayTimerRef.current);
        speakDelayTimerRef.current = null;
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // テキスト読み上げ
  const speak = useCallback(
    (text: string, lang: 'ja' | 'en', onEnd?: () => void, rate?: number, pitch?: number) => {
      if (!isSupported) return;

      // 遅延speakタイマーが残っていたらクリア
      if (speakDelayTimerRef.current !== null) {
        clearTimeout(speakDelayTimerRef.current);
        speakDelayTimerRef.current = null;
      }

      // 既存の読み上げを停止
      window.speechSynthesis.cancel();

      const ttsText = lang === 'ja' ? fixJaReading(text) : text;

      ttsLog(`Speak called: "${text.slice(0, 30)}..." [${lang}] unlocked=${_iosUnlocked}`);

      const doSpeak = () => {
        // iOS: cancel() 後に resume() しないと speak() が無音になるバグを回避
        if (isIOS()) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(ttsText);
        utteranceRef.current = utterance;

        const langCode = lang === 'ja' ? 'ja' : 'en';
        const maleVoice = findMaleVoice(langCode);

        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        // --- 音声パラメータ ---
        // pitch 未指定時はフィクサー用デフォルト（低い男性域 0.45〜0.5）。
        // VIP 等は呼び出し側から pitch を指定して声質を変える。
        if (lang === 'ja') {
          utterance.lang = 'ja-JP';
          utterance.rate = rate ?? 0.95;
          utterance.pitch = pitch ?? 0.45;
        } else {
          utterance.lang = 'en-US';
          utterance.rate = rate ?? 0.85;
          utterance.pitch = pitch ?? 0.5;
        }

        utterance.volume = volumeRef.current;

        ttsLog(`Utterance: voice=${utterance.voice?.name ?? 'default'} lang=${utterance.lang} rate=${utterance.rate} pitch=${utterance.pitch} vol=${utterance.volume}`);

        utterance.onstart = () => {
          setIsSpeaking(true);
          ttsLog('Speech event: onstart');
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          ttsLog('Speech event: onend');
          onEnd?.();
        };
        utterance.onerror = (e) => {
          setIsSpeaking(false);
          ttsLog(`Speech event: onerror (${e.error})`);
          // iOS: "interrupted" / "canceled" はcancel()によるもので正常。onEndを呼ばない。
          // それ以外のエラー（"not-allowed" 等）は TTS 失敗だが、
          // 会話フローを継続するため onEnd を呼ぶ（呼ばないと次のセリフが永久に表示されない）。
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            onEnd?.();
          }
        };

        window.speechSynthesis.speak(utterance);

        // speak() 直後の状態ログ
        {
          const s = window.speechSynthesis;
          ttsLog(`After speak(): speaking=${s.speaking} pending=${s.pending} paused=${s.paused}`);
        }

        if (isIOS()) {
          // ── iOS kick-start ──
          // speak() 後に pending のまま動かないケースがある。
          // 100ms 後に pause→resume で蹴る。
          setTimeout(() => {
            const s = window.speechSynthesis;
            ttsLog(`iOS @100ms: speaking=${s.speaking} pending=${s.pending} paused=${s.paused}`);
            if (!s.speaking) {
              ttsLog('iOS kick-start: pause→resume');
              s.pause();
              s.resume();
            }
          }, 100);

          // ── ストール検出 ──
          // 3秒経っても onstart が来ない場合、iOS が utterance を無視している。
          // 会話フローが永久停止するのを防ぐため onEnd を強制呼出しする。
          setTimeout(() => {
            if (utteranceRef.current !== utterance) return;   // 別の speak() が走った
            const s = window.speechSynthesis;
            ttsLog(`Stall check @3s: speaking=${s.speaking} pending=${s.pending} paused=${s.paused}`);
            if (!s.speaking) {
              ttsLog('Speech stalled: forcing onEnd to continue flow');
              s.cancel();
              setIsSpeaking(false);
              onEnd?.();
            }
          }, 3000);

          // ── 自動 pause 復帰 watchdog ──
          // iOS: speechSynthesis が勝手に pause することがあるバグへの対策
          const watchdog = setInterval(() => {
            if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
              ttsLog('Speech state: paused (auto-resuming)');
              window.speechSynthesis.resume();
            }
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
              clearInterval(watchdog);
            }
          }, 500);
          // 最大30秒で監視打ち切り
          setTimeout(() => clearInterval(watchdog), 30000);
        }
      };

      // cancel() 直後の speak() が無音になるバグ回避
      // iOS: 200ms, Android: 50ms, その他: 遅延なし
      if (isIOS()) {
        speakDelayTimerRef.current = window.setTimeout(() => {
          speakDelayTimerRef.current = null;
          doSpeak();
        }, IOS_CANCEL_SPEAK_DELAY);
      } else if (isAndroid()) {
        speakDelayTimerRef.current = window.setTimeout(() => {
          speakDelayTimerRef.current = null;
          doSpeak();
        }, ANDROID_CANCEL_SPEAK_DELAY);
      } else {
        doSpeak();
      }
    },
    [isSupported, voicesLoaded]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (isSupported) {
        if (speakDelayTimerRef.current !== null) {
          clearTimeout(speakDelayTimerRef.current);
        }
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, setVolume };
}
