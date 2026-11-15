# 龍運金殿・小遊戲廳房音效授權說明

本目錄音效用於正式遊戲的五款小遊戲（幸運彈珠、寶珠對碰：柏青哥彈珠廳；旋風聚寶、三重彩金輪、狂熱倍數：澳門豪華廳）。僅使用 CC0（Creative Commons Zero 1.0，等同公有領域）或本遊戲原創編曲。可作商業用途，無需署名。不含 CC-BY、CC-BY-NC，亦未使用任何版權機台／柏青哥廳房現場帶旋律的錄音。

中獎過門（`b-fanfare`、`b-sparkle`、`b-alarm`、`c-ding`、`c-rapid`、`c-fanfare`）為原創編寫，以下列鐘琴、鋼片琴單音採樣調音、堆疊而成，旋律並非既有機台樂曲。其餘為真實錄音裁切與正規化後使用。詳細試聽頁見 `/sfx-preview/`。

## BigSoundBank / LaSonotheque（全站 CC0）

來源：https://bigsoundbank.com/ （Joseph SARDIN 等）

| 本目錄檔名 | 來源編號 | 用途 |
|---|---|---|
| coins.mp3, coins-b.mp3 | 0194 | 金幣／硬幣灑落 |
| coin.mp3 | 0339 | 單枚投幣 |
| coin-b.mp3 | 0341 | 單枚投幣 |
| chips.mp3 | 0942 | 籌碼碰撞 |
| ratchet.mp3 | 0795 | 棘輪／捲動 |
| reel-mech.mp3 | 1436 | 機械轉動 |
| knocker.mp3 | 3610 | 擊桿／頓點（無樂曲） |
| ball-a.mp3, ball-b.mp3, ball-c.mp3 | 2242, 2243, 2245 | 金屬彈珠碰撞 |
| whoosh.mp3, whoosh-b.mp3 | 1796, 1800 | 發射／揮擊氣音 |
| bell-box.mp3 | 1926 | 盒鐘／頭獎鈴 |
| bell-small.mp3 | 0292 | 小鈴 |
| chime.mp3 | 2079 | 風鈴 |
| chimes-cluster.mp3 | 2687（摘錄） | 風鈴簇 |

僅用於原創過門、未單獨上架：frubu 鐘琴單音與 BigSoundBank 0920、1399。

## Freesound（均已核對為 CC0 1.0）

| 本目錄檔名 | 作者與編號 | 頁面 |
|---|---|---|
| payout.mp3 | jack126guy 361346 | https://freesound.org/people/jack126guy/sounds/361346/ |
| tray.mp3 | LampEight 177985 | https://freesound.org/people/LampEight/sounds/177985/ |
| reel.mp3, reel-stop.mp3 | aghirlandaio 415074（截取轉動與停輪，不含機台樂曲） | https://freesound.org/people/aghirlandaio/sounds/415074/ |
| flipper.mp3, flipper-b.mp3 | schafferdavid 450270 | https://freesound.org/people/schafferdavid/sounds/450270/ |
| bumper.mp3 | tec_studio 361129 | https://freesound.org/people/tec_studio/sounds/361129/ |
| applause.mp3 | Sadiquecat 777709 | https://freesound.org/people/Sadiquecat/sounds/777709/ |
| cheer.mp3 | ShangusBurger 764259 | https://freesound.org/people/ShangusBurger/sounds/764259/ |

原創過門另外使用（皆 CC0，未單獨上架）：frubu 161573／161562／161546／161551；nicholasdaryl 563355。

## 處理方式

裁切、淡入淡出、峰值正規化、輕微限制器後以 96 kbps MP3 輸出。本遊戲經共用 AudioContext 與 `AM.sfxG` 播放，遵循靜音與音量設定。
