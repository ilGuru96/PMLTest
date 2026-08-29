
<!DOCTYPE html>
<html>

<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PokeMisteryRL</title>

  <style>
        /* ============================================================
   PokeMisteryRL
   STYLE REWORK
   CORE JS COMPATIBLE
   ============================================================ */


/* ============================================================
   01. RESET / BASE
   ============================================================ */

*,
*::before,
*::after{
    box-sizing:border-box;
}

html{
    min-height:100%;
    background:#050914;
}

body{
    min-height:100vh;

    margin:0;
    padding:10px;

    background:
        radial-gradient(
            circle at 50% 0%,
            #10213d 0%,
            #08111f 35%,
            #050914 75%
        );

    color:#f5f8ff;

    font-family:
        monospace,
        "Courier New",
        sans-serif;

    text-align:center;

    overflow-x:hidden;
}

button{
    appearance:none;

    border:1px solid #41658e;
    border-radius:8px;

    padding:8px 14px;
    margin:4px;

    background:
        linear-gradient(
            180deg,
            #294b78,
            #183252
        );

    color:#fff;

    font-family:inherit;
    font-size:12px;
    font-weight:bold;

    cursor:pointer;

    transition:
        transform .12s ease,
        background .12s ease,
        border-color .12s ease,
        box-shadow .12s ease;
}

button:hover{
    background:
        linear-gradient(
            180deg,
            #38679f,
            #21446f
        );

    border-color:#5d91c8;

    box-shadow:
        0 0 12px rgba(70,150,255,.18);
}

button:active{
    transform:scale(.96);
}

button.danger{
    background:
        linear-gradient(
            180deg,
            #8b3838,
            #602525
        );

    border-color:#b85b5b;
}

button.danger:hover{
    background:
        linear-gradient(
            180deg,
            #a84747,
            #742d2d
        );
}


/* ============================================================
   02. UTILITIES
   ============================================================ */

.hidden{
    display:none!important;
}


/* ============================================================
   03. MENU
   ============================================================ */

#menu{
    width:min(100%,450px);

    min-height:100vh;

    margin:0 auto;

    display:flex;

    flex-direction:column;

    align-items:center;
    justify-content:center;

    gap:8px;
}

#menu h1{
    margin:0 0 20px;

    color:#55d9ff;

    font-size:24px;
    letter-spacing:2px;

    text-shadow:
        0 0 8px rgba(0,220,255,.55),
        0 0 24px rgba(0,220,255,.2);
}

#menu button{
    min-width:210px;
}


/* ============================================================
   04. GAME
   ============================================================ */

#game{
    width:100%;
}

#gameBox{
    width:100%;
    max-width:450px;

    margin:0 auto;
}


/* ============================================================
   05. MAP WRAPPER
   ============================================================ */

.map-wrap{
    position:relative;

    width:100%;
    min-height:440px;

    padding:14px;

    overflow:hidden;

    background:
        radial-gradient(
            circle at 50% 20%,
            rgba(20,65,105,.4),
            transparent 55%
        ),
        #081525;

    border:1px solid #315579;
    border-radius:16px;

    box-shadow:
        inset 0 0 30px rgba(0,0,0,.35),
        0 8px 25px rgba(0,0,0,.25);
}


/* ============================================================
   MAP SVG
   ============================================================ */

#mapSvg{
    position:absolute;

    inset:0;

    width:100%;
    height:100%;

    pointer-events:none;

    z-index:0;
}


/* ============================================================
   MAP
   ============================================================ */

#map{
    position:relative;

    z-index:1;

    width:100%;
}

.map-row{
    display:flex;

    align-items:center;
    justify-content:center;

    gap:14px;

    margin:15px 0;
}

.node{
    position:relative;

    width:46px;
    height:46px;

    flex:0 0 46px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    border:2px solid #315579;

    background:
        radial-gradient(
            circle,
            #182c45 0%,
            #0b1422 75%
        );

    color:#fff;

    font-size:20px;

    cursor:pointer;

    transition:
        transform .15s ease,
        box-shadow .15s ease,
        opacity .15s ease;
}

.node:hover{
    transform:scale(1.06);
}

.node.available{
    border-color:#ffd43b;

    background:
        radial-gradient(
            circle,
            #3b3505,
            #171600
        );

    box-shadow:
        0 0 7px #ffd43b,
        0 0 18px rgba(255,204,0,.45);

    transform:scale(1.12);
}

.node.current{
    border-color:#00e5ff;

    background:
        radial-gradient(
            circle,
            #063b47,
            #061b23
        );

    box-shadow:
        0 0 8px #00e5ff,
        0 0 20px rgba(0,229,255,.4);
}

.node.done{
    opacity:.45;
}

.node.locked{
    opacity:.22;

    pointer-events:none;
}


/* ============================================================
   MAP CONNECTIONS
   ============================================================ */

.map-line{
    stroke:#315579;

    stroke-width:2;

    opacity:.55;

    stroke-dasharray:6 5;

    stroke-linecap:round;
}

.map-line.available{
    stroke:#ffd43b;

    stroke-width:2.5;

    opacity:1;

    stroke-dasharray:6 5;

    stroke-linecap:round;
}


/* ============================================================
   06. BOTTOM CONTAINER
   ============================================================ */

#bottomContainer{
    width:100%;

    margin-top:8px;
    padding:8px;

    background:
        linear-gradient(
            145deg,
            #112746,
            #0a182c
        );

    border:1px solid #294b70;
    border-radius:16px;

    box-shadow:
        0 8px 20px rgba(0,0,0,.25),
        inset 0 1px 0 rgba(255,255,255,.035);
}


/* ============================================================
   07. MAIN HUD GRID
   ============================================================ */

.bottom-v8{
    width:100%;

    min-height:142px;

    display:grid;

    grid-template-columns:
        17fr
        59fr
        24fr;

    gap:8px;

    text-align:left;
}


/* ============================================================
   08. LEFT HUD
   ============================================================ */

.b8-left{
    width:100%;

    min-width:0;

    display:flex;

    flex-direction:column;

    gap:5px;
}


/* ============================================================
   STARTER 1
   ============================================================ */

#starter1Box{
    width:100%;
    height:68px;

    display:flex;

    align-items:center;
    justify-content:center;

    overflow:hidden;

    background:
        radial-gradient(
            circle,
            #182d4c,
            #071020
        );

    border:2px solid #ffd43b;
    border-radius:12px;

    box-shadow:
        0 0 8px rgba(255,212,59,.12);

    cursor:pointer;
}

#starter1Box img{
    width:56px;
    height:56px;

    object-fit:contain;

    image-rendering:pixelated;
}


/* ============================================================
   STARTER 2
   ============================================================ */

#starter2Slot{
    width:100%;
    height:68px;

    display:flex;

    align-items:center;
    justify-content:center;

    overflow:hidden;

    background:#050a12;

    border:1px solid #315579;
    border-radius:12px;

    color:#7d91aa;

    font-size:10px;
    font-weight:bold;

    cursor:pointer;

    transition:
        border-color .15s ease,
        background .15s ease;
}

#starter2Slot:hover{
    border-color:#4cc3ff;
}

#starter2Slot.filled{
    background:#0b1c2d;

    border-color:#4cc3ff;

    box-shadow:
        0 0 8px rgba(76,195,255,.15);
}

#starter2Slot img{
    width:100%;
    height:100%;

    object-fit:contain;

    image-rendering:pixelated;
}


/* ============================================================
   09. CENTER HUD
   ============================================================ */

.b8-center{
    width:100%;

    min-width:0;

    display:flex;

    flex-direction:column;

    gap:5px;
}


/* ============================================================
   TOP INFORMATION
   ============================================================ */

.b8-top{
    width:100%;

    min-width:0;

    display:flex;

    align-items:center;

    gap:6px;

    flex-wrap:nowrap;

    margin-bottom:2px;
}

.b8-name{
    min-width:0;

    overflow:hidden;

    color:#55d9ff;

    font-size:14px;
    font-weight:bold;

    white-space:nowrap;

    text-overflow:ellipsis;

    text-shadow:
        0 0 7px rgba(76,195,255,.25);
}

.b8-lv{
    flex-shrink:0;

    padding:2px 7px;

    background:#182b49;

    border:1px solid #315579;
    border-radius:20px;

    color:#dceaff;

    font-size:10px;

    white-space:nowrap;
}

.b8-gold{
    margin-left:auto;

    flex-shrink:0;

    color:#ffd43b;

    font-size:11px;
    font-weight:bold;

    white-space:nowrap;
}


/* ============================================================
   TYPES
   ============================================================ */

.b8-typing{
    display:flex;

    flex-direction:row;

    gap:3px;

    margin-left:auto;

    flex-shrink:0;
}

.type-badge{
    display:inline-flex;

    align-items:center;
    justify-content:center;

    padding:3px 6px;

    border-radius:6px;

    color:#fff;

    font-size:8px;
    font-weight:bold;

    line-height:1;

    white-space:nowrap;

    text-align:center;

    text-shadow:
        0 1px 2px rgba(0,0,0,.5);
}


/* ============================================================
   BARS
   ============================================================ */

.b8-bars{
    width:100%;

    display:flex;

    flex-direction:column;

    gap:4px;
}

.b8-bar-row{
    width:100%;

    display:flex;

    align-items:center;

    gap:5px;
}

.b8-icon{
    width:15px;

    flex:0 0 15px;

    font-size:11px;

    text-align:center;
}

.b8-bar-bg{
    position:relative;

    flex:1;

    min-width:0;

    height:10px;

    overflow:hidden;

    background:#03070d;

    border:1px solid #1d3655;
    border-radius:6px;

    box-shadow:
        inset 0 1px 2px rgba(0,0,0,.5);
}

.b8-fill{
    width:0;
    height:100%;

    transition:width .3s ease;
}

.b8-fill.hp{
    background:
        linear-gradient(
            90deg,
            #00d66f,
            #00e5ff
        );

    box-shadow:
        0 0 8px rgba(0,229,255,.25);
}

.b8-fill.fel{
    background:
        linear-gradient(
            90deg,
            #ff6800,
            #ffd23b
        );
}

.b8-value{
    min-width:30px;

    font-size:9px;

    text-align:right;

    white-space:nowrap;
}


/* ============================================================
   STATS
   ============================================================ */

.b8-stats{
    width:100%;

    display:grid;

    grid-template-columns:
        repeat(3,1fr);

    gap:4px;

    padding:4px;

    background:#07111f;

    border:1px solid rgba(49,85,121,.35);
    border-radius:7px;

    font-size:9px;
}

.b8-stats > *{
    min-width:0;

    text-align:center;
}


/* ============================================================
   BONUS
   ============================================================ */

.b8-bonus{
    width:100%;

    display:grid;

    grid-template-columns:
        repeat(3,1fr);

    gap:4px;

    font-size:9px;
}

.b8-chip{
    min-width:0;

    overflow:hidden;

    padding:3px 4px;

    background:#101c31;

    border:1px solid #29445f;
    border-radius:6px;

    text-align:center;

    white-space:nowrap;

    text-overflow:ellipsis;
}


/* ============================================================
   10. RIGHT HUD
   ============================================================ */

.b8-right{
    width:100%;

    min-width:0;

    display:flex;

    flex-direction:column;

    align-items:center;

    gap:5px;

    padding-left:7px;

    border-left:1px solid rgba(49,85,121,.35);
}


/* ============================================================
   TEAM STORAGE
   ============================================================ */

.b8-team{
    width:100%;

    padding:0;

    background:transparent;

    border:0;

    text-align:center;
}

.b8-team-icon{
    font-size:26px;

    line-height:1;
}

.b8-team-text{
    margin-top:2px;

    color:#ffd06b;

    font-size:10px;
    font-weight:bold;

    white-space:nowrap;
}


/* ============================================================
   TEAM SLOTS
   ============================================================ */

.b8-team-slots{
    width:100%;

    display:flex;

    justify-content:center;

    gap:4px;
}

.team-slot{
    width:22px;
    height:22px;

    flex:0 0 22px;

    display:flex;

    align-items:center;
    justify-content:center;

    overflow:hidden;

    background:#03070c;

    border:1px solid #315579;
    border-radius:5px;

    color:#6d819b;

    font-size:10px;

    cursor:pointer;
}

.team-slot:hover{
    border-color:#4cc3ff;
}

.team-slot.filled{
    background:#092415;

    border-color:#2ecc71;

    box-shadow:
        0 0 7px rgba(46,204,113,.15);
}

.team-slot img{
    width:100%;
    height:100%;

    object-fit:contain;

    image-rendering:pixelated;
}


/* ============================================================
   ACTION BUTTONS
   ============================================================ */

.b8-actions{
    width:100%;

    display:flex;

    justify-content:center;

    gap:5px;

    margin-top:auto;
}

.b8-btn{
    width:30px;
    height:30px;

    margin:0;
    padding:0;

    display:flex;

    align-items:center;
    justify-content:center;

    background:#17355e;

    border:1px solid #315f93;
    border-radius:7px;

    color:#fff;

    font-size:14px;
}


/* ============================================================
   11. GENERAL EVENT LOG
   ============================================================ */

#eventLog{
    min-height:18px;

    margin-top:5px;

    color:#8edfff;

    font-size:10px;

    text-align:center;

    pointer-events:none;
}


/* ============================================================
   12. BATTLE
   ============================================================ */

#battleFinal{
    width:100%;

    font-size:12px;
}

.bf-top{
    display:flex;

    gap:8px;

    margin-bottom:8px;
}

.bf-hp{
    flex:1;

    padding:5px;

    background:#03070c;

    border:1px solid #315579;
    border-radius:7px;
}

.bf-field{
    display:flex;

    align-items:center;
    justify-content:space-around;

    margin:8px 0;
    padding:12px;

    background:
        radial-gradient(
            ellipse at center,
            #112b45,
            #071321
        );

    border:1px solid #213e5d;
    border-radius:10px;
}

.bf-sprite{
    position:relative;
}

.bf-sprite img{
    width:72px;
    height:72px;

    object-fit:contain;

    image-rendering:pixelated;
}

.bf-sprite.hit{
    animation:hitShake .25s ease;
}

@keyframes hitShake{
    0%,100%{
        transform:translateX(0);
    }

    25%{
        transform:translateX(-6px);
    }

    75%{
        transform:translateX(6px);
    }
}

.bf-logRow{
    display:flex;

    gap:6px;

    align-items:stretch;
}

.bf-log{
    flex:1;

    height:60px;

    overflow:auto;

    padding:5px;

    background:#02050a;

    border:1px solid #1c334d;
    border-radius:7px;

    color:#d9e8f5;

    font-size:11px;

    text-align:left;
}

.bf-fleeBox{
    display:flex;

    align-items:center;
    justify-content:center;
}

.btn-flee{
    min-width:55px;

    padding:7px;

    background:#663434;
}


/* ============================================================
   BATTLE TEAM
   ============================================================ */

.bf-team{
    display:grid;

    grid-template-columns:
        repeat(3,1fr);

    gap:6px;

    margin-top:8px;
}

.team-label{
    grid-column:1/-1;

    color:#80cfff;

    font-size:10px;
    font-weight:bold;

    text-align:left;
}

.poke-card{
    min-width:0;

    padding:5px;

    background:#03070c;

    border:1px solid #294967;
    border-radius:8px;

    text-align:center;
}

.poke-card.empty{
    opacity:.5;
}

.poke-card img{
    width:40px;
    height:40px;

    object-fit:contain;

    image-rendering:pixelated;
}

.poke-name{
    overflow:hidden;

    font-size:9px;

    white-space:nowrap;
    text-overflow:ellipsis;
}

.poke-lv{
    margin-top:2px;

    color:#a9bfd5;

    font-size:9px;
}

.mini-bar{
    height:5px;

    margin-top:3px;

    overflow:hidden;

    background:#000;

    border-radius:4px;
}

.mini-bar > div{
    height:100%;

    background:#28d67b;

    transition:width .25s ease;
}


/* ============================================================
   DAMAGE NUMBERS
   ============================================================ */

.dmg-num{
    position:absolute;

    left:50%;
    top:10px;

    z-index:10;

    transform:translateX(-50%);

    pointer-events:none;

    font-size:16px;
    font-weight:bold;

    animation:damageFloat .9s ease forwards;

    text-shadow:
        0 2px 3px #000;
}

.dmg-num.crit{
    font-size:20px;
}

.dmg-num.heal{
    font-size:16px;
}

@keyframes damageFloat{
    0%{
        opacity:1;
        transform:
            translate(-50%,0)
            scale(1);
    }

    100%{
        opacity:0;
        transform:
            translate(-50%,-35px)
            scale(1.15);
    }
}


/* ============================================================
   13. GENERAL MODAL
   ============================================================ */

#modal{
    position:fixed;

    inset:0;

    z-index:99;

    display:flex;

    align-items:center;
    justify-content:center;

    padding:12px;

    background:rgba(0,0,0,.86);

    backdrop-filter:blur(3px);
}

#modalContent{
    width:100%;

    min-width:300px;
    max-width:400px;

    max-height:90vh;

    overflow:auto;

    padding:18px;

    background:
        linear-gradient(
            145deg,
            #14243c,
            #0b1525
        );

    border:1px solid #466b96;
    border-radius:14px;

    box-shadow:
        0 20px 60px rgba(0,0,0,.55);
}

.center{
    text-align:center;
}

.center h2{
    margin-top:0;
}


/* ============================================================
   14. POKÉMON PREVIEW
   ============================================================ */

#pokePreview{
    position:fixed;

    inset:0;

    z-index:999;

    display:flex;

    align-items:center;
    justify-content:center;

    padding:12px;

    background:rgba(0,0,0,.86);

    backdrop-filter:blur(3px);
}

#pokePreview.hidden{
    display:none!important;
}

.pp-box{
    position:relative;

    width:100%;
    max-width:340px;

    padding:14px;

    background:
        linear-gradient(
            145deg,
            #142744,
            #0b1729
        );

    border:1px solid #3b6b9d;
    border-radius:16px;

    box-shadow:
        0 20px 60px rgba(0,0,0,.6);
}


/* ============================================================
   PREVIEW TOP
   ============================================================ */

.pp-top{
    position:relative;

    display:flex;

    gap:10px;
}

.pp-sprite-wrap{
    flex:0 0 72px;
}

.pp-top img{
    width:72px;
    height:72px;

    display:block;

    object-fit:contain;

    background:#02060b;

    border:1px solid #263f5d;
    border-radius:10px;

    image-rendering:pixelated;
}

.pp-info{
    min-width:0;

    flex:1;

    text-align:left;
}

.pp-info h3{
    margin:0 28px 4px 0;

    overflow:hidden;

    color:#55d9ff;

    font-size:16px;

    white-space:nowrap;
    text-overflow:ellipsis;
}

.pp-lv{
    display:inline-block;

    margin-bottom:5px;

    padding:2px 7px;

    background:#1a304e;

    border:1px solid #355679;
    border-radius:12px;

    font-size:9px;
}

.pp-types{
    display:flex;

    flex-wrap:wrap;

    gap:3px;

    margin-bottom:6px;
}

.pp-hp{
    width:100%;
    height:9px;

    overflow:hidden;

    background:#000;

    border:1px solid #1c3853;
    border-radius:5px;
}

.pp-fill{
    width:0;
    height:100%;

    background:
        linear-gradient(
            90deg,
            #00d66f,
            #00e5ff
        );

    transition:width .3s ease;
}

#ppHpText{
    display:block;

    margin-top:2px;

    color:#a8bfd4;

    font-size:9px;
}


/* ============================================================
   PREVIEW CLOSE
   ============================================================ */

.pp-close{
    position:absolute;

    top:0;
    right:0;

    width:25px;
    height:25px;

    margin:0;
    padding:0;

    display:flex;

    align-items:center;
    justify-content:center;

    background:#05080d;

    border:1px solid #46566a;
    border-radius:6px;

    font-size:13px;
}


/* ============================================================
   PREVIEW STATS
   ============================================================ */

.pp-stats{
    display:grid;

    grid-template-columns:
        repeat(3,1fr);

    gap:6px;

    margin:10px 0;
    padding:8px;

    background:#07111f;

    border:1px solid #1d3855;
    border-radius:9px;

    font-size:11px;
}

.pp-stats > div{
    text-align:center;
}

.pp-stats b{
    display:block;

    margin-top:2px;

    color:#55d9ff;

    font-size:13px;
}


/* ============================================================
   PREVIEW CUSTOM AREA
   ============================================================ */

.pp-custom{
    padding-top:9px;

    border-top:1px solid rgba(61,96,130,.35);

    text-align:left;
}

.pp-custom h4{
    margin:0 0 7px;

    color:#9ec6e7;

    font-size:11px;
}

.pp-placeholder{
    margin:0;

    opacity:.5;

    font-size:11px;
}

.pp-actions{
    display:flex;

    flex-wrap:wrap;

    gap:4px;

    margin-top:8px;
}

.pp-actions button{
    margin:0;

    font-size:10px;
}


/* ============================================================
   15. TYPE COLORS
   Compatibilità con type-XXX generati dal JS
   ============================================================ */

.type-normale{
    background:#a8a895!important;
}

.type-fuoco{
    background:#f08030!important;
}

.type-acqua{
    background:#6890f0!important;
}

.type-erba{
    background:#78c850!important;
}

.type-elettro{
    background:#f8d030!important;
    color:#222!important;
}

.type-ghiaccio{
    background:#98d8d8!important;
    color:#17333a!important;
}

.type-lotta{
    background:#c03028!important;
}

.type-veleno{
    background:#a040a0!important;
}

.type-terra{
    background:#e0c068!important;
    color:#382b0d!important;
}

.type-volante{
    background:#a890f0!important;
}

.type-psico{
    background:#f85888!important;
}

.type-coleottero{
    background:#a8b820!important;
}

.type-roccia{
    background:#b8a038!important;
}

.type-spettro{
    background:#705898!important;
}

.type-drago{
    background:#7038f8!important;
}

.type-buio{
    background:#705848!important;
}

.type-acciaio{
    background:#b8b8d0!important;
    color:#222!important;
}

.type-folletto{
    background:#ee99ac!important;
}


/* ============================================================
   16. RESPONSIVE
   ============================================================ */

@media (max-width:360px){

    body{
        padding:6px;
    }

    #gameBox{
        max-width:100%;
    }

    .map-wrap{
        min-height:420px;

        padding:10px;
    }

    .map-row{
        gap:10px;

        margin:13px 0;
    }

    .node{
        width:42px;
        height:42px;

        flex-basis:42px;

        font-size:18px;
    }

    #bottomContainer{
        padding:6px;
    }

    .bottom-v8{
        min-height:136px;

        gap:5px;
    }

    .b8-top{
        gap:4px;
    }

    .b8-name{
        font-size:12px;
    }

    .b8-lv{
        padding:1px 5px;

        font-size:9px;
    }

    .b8-gold{
        font-size:9px;
    }

    .type-badge{
        padding:2px 4px;

        font-size:7px;
    }

    .b8-stats{
        gap:3px;

        padding:3px;

        font-size:8px;
    }

    .b8-bonus{
        gap:3px;

        font-size:8px;
    }

    .b8-chip{
        padding:2px 3px;
    }

    .b8-right{
        gap:4px;

        padding-left:5px;
    }

    .b8-team-icon{
        font-size:23px;
    }

    .b8-team-text{
        font-size:8px;
    }

    .team-slot{
        width:19px;
        height:19px;

        flex-basis:19px;
    }

    .b8-btn{
        width:27px;
        height:27px;

        font-size:12px;
    }

    .pp-box{
        max-width:calc(100vw - 24px);
    }

    #modalContent{
        min-width:0;

        width:100%;
    }
}


/* ============================================================
   17. TABLET / DESKTOP
   ============================================================ */

@media (min-width:700px){

    body{
        padding-top:20px;
    }

    #gameBox{
        max-width:520px;
    }

    .map-wrap{
        min-height:500px;
    }
}
  /* ============================================================
   SKILL PILL
   ============================================================ */

.pp-skills{
    width:100%;
    margin:0 0 8px;
}

.pp-skill-pill{
    width:100%;
    min-height:34px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    padding:7px 10px;
    background:linear-gradient(180deg,#132b49,#0a182b);
    border:1px solid #315f93;
    border-radius:8px;
    box-shadow:0 0 8px rgba(76,195,255,.12);
}

.pp-skill-name{
    min-width:0;
    overflow:hidden;
    color:#55d9ff;
    font-size:11px;
    font-weight:bold;
    white-space:nowrap;
    text-overflow:ellipsis;
}

.pp-skill-power{
    flex:0 0 auto;
    color:#ffd43b;
    font-size:10px;
    font-weight:bold;
    white-space:nowrap;
}



/* PokeMisteryRL HUD refinement V2 */

#bottomContainer{
    padding:7px;
    margin-top:8px;
    border-radius:14px;
    background:linear-gradient(145deg,#10233d,#081525);
    border-color:#294e73;
}

.bottom-v8{
    min-height:140px;
    grid-template-columns:minmax(72px,17fr) minmax(0,59fr) minmax(82px,24fr);
    gap:7px;
}

.b8-left{
    gap:5px;
}

#starter1Box,
#starter2Slot{
    height:64px;
    border-radius:11px;
}

#starter1Box img{
    width:54px;
    height:54px;
}

#starter2Slot img{
    width:58px;
    height:58px;
}

#starter1Box:hover{
    background:radial-gradient(circle,#203b60,#081322);
    box-shadow:0 0 10px rgba(255,212,59,.18);
}

#starter2Slot:hover{
    background:#0a1a2a;
    box-shadow:0 0 8px rgba(76,195,255,.12);
}

.b8-center{
    gap:4px;
}

.b8-top{
    gap:5px;
    margin-bottom:1px;
}

.b8-name{
    font-size:13px;
    letter-spacing:.1px;
}

.b8-lv{
    padding:2px 6px;
    font-size:9px;
}

.b8-gold{
    font-size:10px;
}

.type-badge{
    padding:3px 5px;
    font-size:7px;
    border-radius:5px;
}

.b8-bars{
    gap:3px;
}

.b8-bar-row{
    gap:4px;
}

.b8-icon{
    width:14px;
    flex-basis:14px;
    font-size:10px;
}

.b8-bar-bg{
    height:9px;
    border-radius:5px;
}

.b8-value{
    min-width:35px;
    font-size:8px;
    color:#dcecff;
}

.b8-stats{
    margin-top:1px;
    gap:2px;
    padding:3px;
    border-radius:6px;
    font-size:8px;
}

.b8-stats b{
    color:#f1f8ff;
}

.b8-bonus{
    gap:3px;
    font-size:8px;
}

.b8-chip{
    padding:3px 3px;
    border-radius:5px;
}

.b8-right{
    gap:4px;
    padding-left:6px;
    border-left-color:rgba(76,139,190,.28);
}

.b8-team-icon{
    font-size:25px;
}

.b8-team-text{
    font-size:9px;
}

.b8-team-slots{
    gap:3px;
}

.team-slot{
    width:21px;
    height:21px;
    flex-basis:21px;
    border-radius:5px;
}

.b8-actions{
    gap:4px;
}

.b8-btn{
    width:29px;
    height:29px;
    border-radius:7px;
}

/* ============================================================
   BOTTOM REWORK - TEAM / INVENTORY / RUN LOG
   ============================================================ */
.b8-right{
    position:relative;
    min-height:140px;
}
.b8-right-main,.b8-inventory-panel{
    width:100%;
    min-width:0;
    height:100%;
    display:flex;
    flex-direction:column;
    gap:5px;
}
.b8-right-main{
    justify-content:space-between;
}
.b8-incubator{
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:5px;
    padding:4px;
    border:1px solid #315579;
    border-radius:7px;
    background:#071321;
    font-size:8px;
}
.b8-incubator span{font-size:15px;}
.b8-incubator div{display:flex;flex-direction:column;align-items:center;}
.b8-incubator small{font-size:7px;color:#9ec8e8;margin-top:2px;}
.b8-team-viewer{
    flex:1;
    min-height:62px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:1px;
}
.b8-team-header{
    width:100%;
    display:flex;
    justify-content:center;
    gap:4px;
    font-size:8px;
    color:#ffd06b;
}
.b8-team-image-wrap{
    width:100%;
    min-height:42px;
    display:grid;
    grid-template-columns:18px minmax(0,1fr) 18px;
    align-items:center;
    justify-items:center;
}
#teamViewerSprite{
    width:42px;height:42px;object-fit:contain;image-rendering:pixelated;
}
.team-nav{
    width:18px;height:22px;margin:0;padding:0;border:0;background:transparent;box-shadow:none;font-size:9px;
}
.team-nav:disabled{opacity:.25;cursor:default;}
.b8-team-viewer-name{
    max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:7px;font-weight:bold;color:#dcecff;
}
.b8-team-viewer-level{font-size:6px;color:#8fa9c2;}
.b8-inventory-btn{
    width:100%;margin:0;padding:6px 3px;font-size:7px;border-radius:7px;
}
.b8-inventory-panel{
    overflow:hidden;
    justify-content:flex-start;
}
.b8-inventory-title{
    color:#55d9ff;font-size:9px;font-weight:900;text-align:center;
}
.b8-inventory-section{
    min-width:0;
    display:flex;flex-direction:column;gap:2px;
}
.b8-inventory-section>b{font-size:7px;color:#ffd06b;}
.inventory-list{
    min-height:22px;max-height:43px;overflow:auto;display:flex;flex-direction:column;gap:2px;
}
.inventory-entry{
    display:grid;grid-template-columns:16px minmax(0,1fr) auto;align-items:center;gap:2px;
    padding:2px 3px;border:1px solid #29445f;border-radius:5px;background:#071321;font-size:6px;
}
.inventory-icon{text-align:center;font-size:10px;}
.inventory-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.inventory-empty{padding:4px;text-align:center;color:#6d819b;font-size:6px;}
.b8-inventory-incubator{
    padding:3px;text-align:center;border:1px solid #29445f;border-radius:5px;background:#071321;font-size:6px;
}
.b8-inventory-close{
    width:100%;margin:0;padding:5px 2px;font-size:7px;
}
.run-log-panel{
    width:100%;margin-top:6px;border:1px solid #294b70;border-radius:10px;background:#071321;overflow:hidden;text-align:left;
}
.run-log-toggle{
    width:100%;margin:0;padding:7px 9px;display:flex;justify-content:space-between;align-items:center;
    border:0;border-radius:0;background:linear-gradient(145deg,#10233d,#081525);font-size:8px;
}
.run-log-content{
    display:none;max-height:180px;overflow-y:auto;padding:6px 8px;border-top:1px solid #294b70;font-size:8px;color:#b9d8ef;
}
.run-log-line{padding:3px 0;border-bottom:1px solid rgba(49,85,121,.18);}
.run-log-line:last-child{border-bottom:0;}

/* Preview */

.pp-box{
    width:min(100%,350px);
    padding:13px;
    border-radius:14px;
    background:linear-gradient(145deg,#132946,#091727);
    border-color:#38658e;
}

.pp-top{
    gap:9px;
}

.pp-sprite-wrap{
    flex-basis:70px;
}

.pp-top img{
    width:70px;
    height:70px;
    border-radius:10px;
}

.pp-info h3{
    font-size:15px;
}

.pp-hp{
    height:9px;
}

.pp-stats{
    margin:9px 0;
    padding:7px;
    gap:5px;
    border-radius:8px;
    font-size:10px;
}

.pp-stats b{
    font-size:12px;
}

.pp-skill-pill{
    min-height:35px;
    padding:7px 9px;
    border-radius:8px;
}

/* Mobile */

@media (max-width:480px){
    body{
        padding:6px;
    }

    #gameBox{
        width:100%;
        max-width:450px;
    }

    #bottomContainer{
        padding:6px;
    }

    .bottom-v8{
        min-height:136px;
        grid-template-columns:72px minmax(0,1fr) 84px;
        gap:5px;
    }

    #starter1Box,
    #starter2Slot{
        height:61px;
    }

    #starter1Box img{
        width:52px;
        height:52px;
    }

    #starter2Slot img{
        width:55px;
        height:55px;
    }

    .b8-name{
        font-size:12px;
    }

    .b8-lv{
        font-size:8px;
        padding:2px 5px;
    }

    .b8-gold{
        font-size:9px;
    }

    .type-badge{
        padding:2px 4px;
        font-size:6px;
    }

    .b8-value{
        min-width:32px;
        font-size:7px;
    }

    .b8-stats,
    .b8-bonus{
        font-size:7px;
    }

    .b8-right{
        padding-left:4px;
    }

    .b8-team-icon{
        font-size:23px;
    }

    .b8-team-text{
        font-size:8px;
    }

    .team-slot{
        width:19px;
        height:19px;
        flex-basis:19px;
    }

    .b8-btn{
        width:27px;
        height:27px;
        font-size:12px;
    }
}


/* BOTTOM IMAGE LAYOUT */

.bottom-v8{
    grid-template-columns:80px minmax(0,1fr) 112px;
    gap:7px;
    align-items:stretch;
}

.b8-left{
    display:flex;
    flex-direction:column;
    gap:5px;
}

.b8-pokemon-slot{
    position:relative;
    overflow:hidden;
}

.b8-slot-s1{
    border-color:#ffd400;
}

.b8-slot-s2{
    border-color:#00cfff;
}

.b8-slot-label{
    position:absolute;
    top:3px;
    left:4px;
    z-index:2;
    padding:2px 4px;
    border-radius:4px;
    background:#123d91;
    color:#fff;
    font-size:7px;
    font-weight:900;
}

.b8-center{
    min-width:0;
    display:flex;
    flex-direction:column;
    gap:5px;
}

.b8-pokemon-info{
    min-width:0;
    display:flex;
    flex-direction:column;
    gap:3px;
}

.b8-top{
    min-width:0;
}

.b8-name{
    min-width:0;
    max-width:42%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}

.b8-typing{
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:3px;
    min-width:0;
}

.b8-s2-section{
    min-width:0;
    display:flex;
    flex-direction:column;
    gap:3px;
    padding-top:5px;
    border-top:1px solid rgba(50,115,170,.35);
}

.b8-s2-header{
    min-width:0;
    display:flex;
    align-items:center;
    gap:5px;
}

.b8-s2-name{
    min-width:0;
    max-width:45%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    color:#e8f5ff;
    font-size:10px;
    font-weight:800;
}

.b8-s2-level{
    flex:0 0 auto;
    padding:2px 5px;
    border:1px solid #315b82;
    border-radius:5px;
    background:#081a2c;
    color:#dcecff;
    font-size:7px;
    font-weight:800;
    line-height:1;
}

.b8-s2-typing{
    margin-left:auto;
}

.b8-right{
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:stretch;
    gap:8px;
    padding-left:7px;
    border-left:1px solid rgba(60,120,170,.38);
}

.b8-team-slots{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:4px;
    margin-top:4px;
}

.team-slot{
    width:28px;
    height:28px;
    flex:0 0 28px;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    border-radius:7px;
}

.team-slot img{
    width:25px !important;
    height:25px !important;
    max-width:25px;
    max-height:25px;
    object-fit:contain;
    image-rendering:auto;
}

.b8-currency-box{
    min-height:34px;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;
    padding:5px 8px;
    border:1px solid #2d5f8c;
    border-radius:8px;
    background:rgba(3,18,34,.72);
    color:#ffd83d;
    font-size:10px;
    font-weight:900;
}

.b8-currency-icon{
    font-size:13px;
}

.b8-actions{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:5px;
}

.b8-btn-large{
    min-width:0;
    width:100%;
    height:42px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:1px;
    border-radius:8px;
    font-size:7px;
    font-weight:900;
}

.b8-btn-icon{
    font-size:16px;
    line-height:1;
}

@media (max-width:900px){

    .bottom-v8{
        grid-template-columns:72px minmax(0,1fr) 92px;
        gap:5px;
    }

    .b8-right{
        padding-left:5px;
    }

    .team-slot{
        width:24px;
        height:24px;
        flex-basis:24px;
    }

    .team-slot img{
        width:21px !important;
        height:21px !important;
        max-width:21px;
        max-height:21px;
    }

    .b8-currency-box{
        min-height:29px;
        font-size:8px;
    }

    .b8-btn-large{
        height:35px;
        font-size:6px;
    }

    .b8-btn-icon{
        font-size:13px;
    }
}

@media (max-width:500px){

    .bottom-v8{
        grid-template-columns:68px minmax(0,1fr) 82px;
        gap:4px;
    }

    .b8-slot-label{
        font-size:6px;
    }

    .b8-s2-name{
        font-size:8px;
    }

    .b8-s2-level{
        font-size:6px;
        padding:2px 4px;
    }

    .team-slot{
        width:21px;
        height:21px;
        flex-basis:21px;
    }

    .team-slot img{
        width:18px !important;
        height:18px !important;
        max-width:18px;
        max-height:18px;
    }

    .b8-currency-box{
        min-height:26px;
        font-size:7px;
        padding:4px;
    }

    .b8-currency-icon{
        font-size:10px;
    }

    .b8-btn-large{
        height:31px;
        font-size:5px;
    }

    .b8-btn-icon{
        font-size:11px;
    }
}


  
/* ============================================================
   RECRUITMENT PROMPT
   ============================================================ */
.recruitment-box{
  width:min(92vw,360px);
  margin:auto;
  padding:18px;
  text-align:center;
  border:1px solid rgba(255,255,255,.18);
  border-radius:16px;
  background:rgba(5,10,20,.96);
  box-shadow:0 12px 35px rgba(0,0,0,.45);
}
.recruitment-title{
  margin:0 0 6px;
  font-size:20px;
}
.recruitment-message{
  margin:6px 0 14px;
  opacity:.9;
}
.recruitment-sprite{
  display:block;
  width:112px;
  height:112px;
  object-fit:contain;
  margin:8px auto 12px;
  image-rendering:auto;
}
.recruitment-name{
  font-size:18px;
  font-weight:700;
  margin-bottom:4px;
}
.recruitment-type{
  opacity:.7;
  font-size:12px;
  margin-bottom:14px;
}
.recruitment-actions{
  display:flex;
  gap:10px;
  justify-content:center;
}
.recruitment-actions button{
  flex:1;
  min-height:42px;
  font-weight:700;
}
.recruitment-actions .reject{
  opacity:.75;
}

</style>

  

<style id="bottomInteractionFixCss">
#bottomInventoryPanel{height:100%;box-sizing:border-box;overflow:auto;padding:7px}
.bip-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.bip-head button{border:1px solid #315d83;background:#102238;color:#fff;border-radius:6px;padding:3px 7px}
.bip-title{font-size:8px;font-weight:900;margin-bottom:5px}
.bip-row{display:flex;justify-content:space-between;gap:6px;padding:5px;border:1px solid rgba(70,120,165,.4);border-radius:6px;margin-bottom:3px;font-size:8px}
.bip-empty{font-size:8px;opacity:.65}
#bottomContainer .team-slot,
#bottomContainer [data-team-index]{cursor:pointer}
</style>

<style id="s2CompanionSelectionCss">
.s2-choice-list{
  display:flex;
  flex-direction:column;
  gap:6px;
  max-height:320px;
  overflow-y:auto;
  padding:2px;
}

.s2-choice-card{
  width:100%;
  min-height:64px;
  margin:0;
  padding:6px 8px;
  display:flex;
  align-items:center;
  gap:9px;
  text-align:left;
  background:#0b1c2d;
  border:1px solid #315579;
  border-radius:9px;
}

.s2-choice-card:hover{
  border-color:#4cc3ff;
  background:#102840;
}

.s2-choice-card.selected{
  border-color:#4cc3ff;
  box-shadow:0 0 8px rgba(76,195,255,.2);
}

.s2-choice-card img{
  width:48px;
  height:48px;
  flex:0 0 48px;
  object-fit:contain;
  image-rendering:pixelated;
}

.s2-choice-info{
  min-width:0;
  flex:1;
  display:flex;
  flex-direction:column;
  gap:2px;
  font-size:9px;
}

.s2-choice-info b{
  color:#55d9ff;
  font-size:11px;
}

.s2-choice-types{
  display:flex;
  gap:3px;
}

.s2-current{
  color:#4cc3ff;
  font-size:9px;
}
</style>


<style id="s2ChoiceCorrectedCss">
.s2-choice-list{
  display:flex;
  flex-direction:column;
  gap:5px;
  max-height:240px;
  overflow-y:auto;
  padding:2px;
}

.s2-choice-card{
  width:100%;
  min-height:58px;
  margin:0;
  padding:5px 7px;
  display:flex;
  align-items:center;
  gap:8px;
  text-align:left;
  background:#0b1c2d;
  border:1px solid #315579;
  border-radius:8px;
  color:#fff;
}

.s2-choice-card:hover{
  border-color:#4cc3ff;
  background:#102840;
}

.s2-choice-card.selected{
  border-color:#4cc3ff;
  box-shadow:0 0 8px rgba(76,195,255,.2);
}

.s2-choice-card img{
  width:46px;
  height:46px;
  flex:0 0 46px;
  object-fit:contain;
  image-rendering:pixelated;
}

.s2-choice-info{
  min-width:0;
  flex:1;
  display:flex;
  flex-direction:column;
  gap:2px;
  font-size:8px;
}

.s2-choice-info b{
  color:#55d9ff;
  font-size:10px;
}

.s2-choice-types{
  display:flex;
  gap:3px;
}

.s2-current{
  color:#4cc3ff;
  font-size:9px;
}
</style>

<style id="modalOrderFixCss">
body.modal-child-open .modal:not(:last-of-type),
body.modal-child-open #pokePreview:not(:last-child){
  pointer-events:none;
}
</style>

<style id="strictModalLockCss">
#modal,
#pokePreview,
.modal,
[role="dialog"]{
  z-index:99999 !important;
}
</style>

<style id="absoluteModalBackdropCss">
#pokePreview,
#modal{
  position:fixed !important;
  z-index:1000000 !important;
}
#pokePreview{
  pointer-events:auto !important;
}
#pokePreview .pp-box,
#modal .modal-box{
  pointer-events:auto !important;
}
</style>
<style id="mapPlaceholderFinalCss">
.node.map-placeholder{
  opacity:.38;
  cursor:default !important;
  pointer-events:none !important;
  user-select:none;
}
.node.map-placeholder::before{
  content:"";
  position:absolute;
  inset:5px;
  border:1px dashed currentColor;
  border-radius:50%;
  opacity:.35;
  pointer-events:none;
}
</style>

<style id="teamRotationRealFixCss">
#teamPrevBtn,
#teamNextBtn{
  position:relative;
  z-index:20;
  pointer-events:auto;
}
#teamPrevBtn:disabled,
#teamNextBtn:disabled{
  pointer-events:none;
}
</style>

<style id="shopEnabledCss">
.shop-box{
  width:min(100%,380px);
}
.shop-list{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:6px;
  margin:10px 0;
}
.shop-card{
  min-width:0;
  padding:7px;
  border:1px solid #315579;
  border-radius:8px;
  background:#071321;
  text-align:center;
}
.shop-icon{
  font-size:24px;
  line-height:1.1;
}
.shop-name{
  margin-top:3px;
  overflow:hidden;
  font-size:9px;
  font-weight:bold;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.shop-rarity{
  margin-top:2px;
  color:#ffd06b;
  font-size:7px;
}
.shop-effect{
  min-height:34px;
  margin-top:4px;
  color:#9db8ca;
  font-size:7px;
}
.shop-price{
  margin-top:5px;
  color:#ffd43b;
  font-size:9px;
  font-weight:bold;
}
.shop-card button{
  width:100%;
  margin:5px 0 0;
  padding:5px 2px;
  font-size:7px;
}
@media (max-width:480px){
  .shop-list{grid-template-columns:1fr}
}
</style>

<style id="playerSpriteMirrorFix">
/*
 * S1 / S2 — orientamento specchiato
 * Applicato sia al BOTTOM sia alla BATTLE UI.
 *
 * L'enemy NON viene modificato.
 */

/* BOTTOM */
#starter1Box img,
#starter2Slot img,
#teamViewerSprite{
  transform:scaleX(-1);
}

/* BATTLE */
.bf-sprite.s1 img,
.bf-sprite.s2 img{
  transform:scaleX(-1);
}
</style>
<style id="mapBattleVisualFinal">
#map .node{
  position:relative !important;
  overflow:visible !important;
}
#map .node .map-enemy-preview-final{
  position:absolute !important;
  left:50% !important;
  top:54% !important;
  width:42px !important;
  height:42px !important;
  max-width:42px !important;
  max-height:42px !important;
  transform:translate(-50%,-50%) !important;
  object-fit:contain !important;
  display:block !important;
  visibility:visible !important;
  opacity:1 !important;
  z-index:30 !important;
  pointer-events:none !important;
}
#map .node .map-sword-final{
  position:absolute !important;
  top:-9px !important;
  right:-7px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:22px !important;
  height:22px !important;
  font-size:16px !important;
  line-height:1 !important;
  z-index:40 !important;
  pointer-events:none !important;
  filter:drop-shadow(0 2px 2px rgba(0,0,0,.95)) !important;
}
#map .node.boss .map-enemy-preview-final{
  width:46px !important;
  height:46px !important;
  max-width:46px !important;
  max-height:46px !important;
}
</style>

<style id="mapSpriteTransparentCrop">
#map .node .map-enemy-preview-crop{
  position:absolute !important;
  left:50% !important;
  top:54% !important;

  width:58px !important;
  height:58px !important;

  transform:translate(-50%,-50%) !important;

  display:block !important;
  overflow:visible !important;

  z-index:30 !important;
  pointer-events:none !important;
}

#map .node .map-enemy-preview-final{
  position:absolute !important;

  left:50% !important;
  top:50% !important;

  /*
   * Lo sprite viene centrato esattamente nella finestra di crop.
   * object-position evita spostamenti dovuti alla dimensione del box PNG.
   */
  width:58px !important;
  height:58px !important;
  max-width:none !important;
  max-height:none !important;

  transform:translate(-50%,-50%) scale(1.15) !important;

  object-fit:contain !important;
  object-position:50% 50% !important;

  display:block !important;
  visibility:visible !important;
  opacity:1 !important;

  image-rendering:auto !important;
}

#map .node.boss .map-enemy-preview-crop{
  width:64px !important;
  height:64px !important;
}

#map .node.boss .map-enemy-preview-final{
  width:64px !important;
  height:64px !important;
}
</style>

<style id="mapSpriteCenterFinal">
#map .node .map-enemy-preview-crop,
#map .node.boss .map-enemy-preview-crop{
  left:50% !important;
  top:calc(54% - 20px) !important;
  transform:translate(-50%,-50%) !important;
}
</style>

<style id="skillChoiceRunSafe">
.skill-node{width:100%}
.skill-node-subtitle{margin:4px 0 10px;font-size:10px;opacity:.75}
.skill-choice-list{display:flex;flex-direction:column;gap:9px}
.skill-choice-card{
  width:100%;padding:9px;border:1px solid #315f93;border-radius:10px;
  background:linear-gradient(145deg,#10243d,#071321);text-align:left;
}
.skill-choice-empty{opacity:.55}
.skill-choice-head{
  display:grid;grid-template-columns:25px minmax(0,1fr) auto;
  align-items:center;gap:6px;margin-bottom:7px;
}
.skill-choice-head>b{color:#55d9ff;font-size:10px}
.skill-choice-head>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;font-weight:900}
.skill-choice-head>em{font-style:normal;padding:2px 5px;border:1px solid #315579;border-radius:5px;background:#081a2c;font-size:7px}
.skill-choice-body{display:grid;grid-template-columns:70px minmax(0,1fr);align-items:center;gap:10px}
.skill-choice-sprite{
  width:70px;height:70px;display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:#03070c;border:1px solid #294967;border-radius:8px;
}
.skill-choice-sprite img{width:66px;height:66px;object-fit:contain}
.skill-choice-moves{
  min-width:0;display:grid;grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr);
  align-items:center;gap:6px;
}
.skill-move-box{
  min-width:0;min-height:58px;padding:8px;display:flex;flex-direction:column;
  justify-content:center;background:#071321;border:1px solid #29445f;border-radius:7px;
}
.skill-move-box.skill-move-next{border-color:#4cc3ff}
.skill-move-box small{font-size:7px;color:#8fa9c2;font-weight:900}
.skill-move-box strong{margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:1.2}
.skill-move-box span{margin-top:4px;color:#ffd43b;font-size:8px}
.skill-arrow{color:#55d9ff;font-size:22px;font-weight:900;text-align:center}
.skill-choice-card button{width:100%;margin:7px 0 0;padding:8px;font-size:10px}
</style>

<style id="skillChoiceSpriteFix">
/* Mantiene le proporzioni originali dei PNG S1/S2 */
.skill-choice-sprite{
  aspect-ratio:1 / 1 !important;
  width:70px !important;
  height:70px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  overflow:hidden !important;
}
.skill-choice-sprite img{
  display:block !important;
  width:auto !important;
  height:auto !important;
  max-width:100% !important;
  max-height:100% !important;
  object-fit:contain !important;
  object-position:center center !important;
}
</style>

<style id="bottomS1S2SpriteRatioFix">
/*
 * BOTTOM — S1 / S2
 * Stesso principio usato per gli sprite corretti dei nodi:
 * il box resta quadrato, ma l'immagine mantiene le proporzioni
 * originali del PNG. Nessuna deformazione.
 */
#starter1Box img,
#starter2Slot img{
  display:block !important;
  width:auto !important;
  height:auto !important;
  max-width:100% !important;
  max-height:100% !important;
  object-fit:contain !important;
  object-position:center center !important;
}
</style>

<style id="bottomS1S2SpriteLarge">
/*
 * BOTTOM — S1 / S2
 * Sprite molto più grandi, ma senza deformazione.
 * Il box resta quello originale.
 */
#starter1Box img,
#starter2Slot img{
  display:block !important;
  width:auto !important;
  height:auto !important;

  /* ingrandimento mantenendo le proporzioni del PNG */
  min-width:0 !important;
  min-height:0 !important;
  max-width:none !important;
  max-height:none !important;

  transform:scale(1.55) !important;
  transform-origin:center center !important;

  object-fit:contain !important;
  object-position:center center !important;
}
</style>

<style id="bottomS1S2SpriteUp20">
#starter1Box img,
#starter2Slot img{
  position:relative !important;
  top:-20px !important;
}
</style>

<style id="s1HpValueAtBarEnd">
.bf-hp.blue{
  position:relative !important;
}
.bf-hp.blue #s1HpTxt{
  position:absolute !important;
  right:0 !important;
  bottom:calc(100% + 2px) !important;
  font-size:8px !important;
  line-height:1 !important;
  white-space:nowrap !important;
}
</style>

<style id="bottomS1S2MirrorFix">
/* S1 e S2 nel Bottom: sempre specchiati orizzontalmente */
#starter1Box img,
#starter2Slot img{
  transform:scaleX(-1) !important;
  transform-origin:center center !important;
}
</style>

<style id="skillLv3RerollStyle">
.skill-choice-card button{
  width:100%;
  margin-top:7px;
  padding:8px;
  font-size:10px;
}
</style>

<style id="s2TabCloseX">
.s2-tab-close{
  position:absolute !important;
  top:8px !important;
  right:8px !important;
  width:30px !important;
  height:30px !important;
  min-width:30px !important;
  margin:0 !important;
  padding:0 !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  border-radius:7px !important;
  font-size:16px !important;
  line-height:1 !important;
  z-index:100 !important;
}
</style>

<style id="s2NoCompanionPosition">
.s2-no-companion-modal{
  position:relative !important;
}
</style>

<style id="s2CloseXInsideBox">
.s2-no-companion-modal{
  position:relative !important;
}

.s2-no-companion-modal .s2-tab-close{
  position:absolute !important;
  top:6px !important;
  right:6px !important;
  width:26px !important;
  height:26px !important;
  min-width:26px !important;
  margin:0 !important;
  padding:0 !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  font-size:15px !important;
  line-height:1 !important;
}
</style>

<style id="s2CloseXExactBox">
.s2-no-companion-modal{
  position:relative !important;
}

.s2-no-companion-modal .s2-tab-close{
  position:absolute !important;
  top:6px !important;
  right:6px !important;
  width:24px !important;
  height:24px !important;
  min-width:24px !important;
  margin:0 !important;
  padding:0 !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  z-index:999 !important;
  font-size:14px !important;
  line-height:1 !important;
}
</style>

<style id="s2CloseXMatchS1RealBox">
#modalContent{
  position:relative !important;
}

#modalContent > .s2-no-companion-modal{
  position:static !important;
}

#modalContent > .s2-no-companion-modal > .s2-tab-close{
  position:absolute !important;
  top:0 !important;
  right:0 !important;
  width:25px !important;
  height:25px !important;
  min-width:25px !important;
  margin:0 !important;
  padding:0 !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  background:#05080d !important;
  border:1px solid #46566a !important;
  border-radius:6px !important;
  font-size:13px !important;
  line-height:1 !important;
  z-index:1000 !important;
}
</style>

<style id="bottomS1S2Down5">
#starter1Box img,
#starter2Slot img{
  position:relative !important;
  top:-15px !important;
}
</style>

<style id="fullTeamSwitchRestore">
.recruitment-box{
  position:relative;
  width:min(100%,390px);
  max-height:90vh;
  overflow-y:auto;
  padding:16px;
  border-radius:14px;
  background:linear-gradient(145deg,#142744,#071321);
  border:1px solid #3b6b9d;
  box-shadow:0 20px 60px rgba(0,0,0,.65);
  color:#fff;
}
.recruitment-box h2{
  margin:0 0 10px;
  font-size:18px;
}
.recruit-close-x{
  position:absolute;
  top:0;
  right:0;
  width:25px;
  height:25px;
  margin:0;
  padding:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#05080d;
  border:1px solid #46566a;
  border-radius:6px;
  font-size:13px;
}
.recruit-card{
  padding:8px;
  border:1px solid #315579;
  border-radius:10px;
  background:#081523;
}
.recruit-card-title{
  margin-bottom:6px;
  color:#8fa9c2;
  font-size:7px;
  font-weight:900;
}
.recruit-card-main{
  display:grid;
  grid-template-columns:72px minmax(0,1fr);
  gap:10px;
  align-items:center;
}
.recruit-card-sprite{
  width:72px;
  height:72px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  border:1px solid #294967;
  border-radius:8px;
  background:#03070c;
}
.recruit-card-sprite img{
  width:auto;
  height:auto;
  max-width:100%;
  max-height:100%;
  object-fit:contain;
}
.recruit-card-info{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:2px;
  text-align:left;
  font-size:9px;
}
.recruit-name{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:#55d9ff;
  font-size:12px;
}
.recruit-skill{
  margin-top:4px;
  padding:4px 5px;
  border:1px solid #29445f;
  border-radius:6px;
  background:#071321;
}
.recruit-skill small{
  display:block;
  color:#8fa9c2;
  font-size:6px;
}
.recruit-skill b{
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-size:9px;
}
.recruit-skill span{
  color:#ffd43b;
  font-size:7px;
}
.recruit-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:5px;
  margin-top:6px;
}
.recruit-stats div{
  padding:5px;
  text-align:center;
  border-radius:6px;
  background:#071321;
  border:1px solid #29445f;
}
.recruit-stats small{
  display:block;
  color:#8fa9c2;
  font-size:6px;
}
.recruit-stats b{
  color:#55d9ff;
  font-size:11px;
}
.recruit-divider{
  margin:12px 0 7px;
  color:#55d9ff;
  font-size:10px;
  font-weight:900;
  text-align:left;
}
.recruit-options{
  display:flex;
  flex-direction:column;
  gap:5px;
}
.recruit-option{
  width:100%;
  min-height:58px;
  margin:0;
  padding:5px 7px;
  display:grid;
  grid-template-columns:46px minmax(0,1fr) auto;
  align-items:center;
  gap:8px;
  text-align:left;
  border:1px solid #315579;
  border-radius:8px;
  background:#0b1c2d;
  color:#fff;
}
.recruit-option:hover{
  border-color:#4cc3ff;
  background:#102840;
}
.recruit-option img{
  width:46px;
  height:46px;
  object-fit:contain;
}
.recruit-option span{
  min-width:0;
}
.recruit-option b{
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-size:10px;
}
.recruit-option small{
  display:block;
  margin-top:2px;
  color:#8fa9c2;
  font-size:7px;
}
.recruit-option strong{
  color:#55d9ff;
  font-size:7px;
}
.recruit-compare-grid{
  display:grid;
  grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr);
  align-items:center;
  gap:5px;
}
.recruit-compare-arrow{
  color:#55d9ff;
  font-size:20px;
  font-weight:900;
  text-align:center;
}
.recruit-compare-note{
  margin:8px 0;
  color:#c0cfdd;
  font-size:8px;
}
.recruit-compare-actions{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:6px;
}
.recruit-compare-actions button{
  width:100%;
}
.recruit-empty{
  padding:10px;
  text-align:center;
  color:#8fa9c2;
  font-size:9px;
}
</style>

<style id="battleS2DeadStyle">
.bf-sprite.s2.dead img{
  filter:grayscale(1);
  opacity:.45;
}
</style>

<style id="battleMinimalHudFinal">
#battleFinal .bf-top{
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:8px !important;
}

#battleFinal .bf-hp{
  display:flex !important;
  flex-direction:column !important;
  gap:4px !important;
  min-width:0 !important;
  padding:7px !important;
}

#battleFinal .bf-name-row{
  display:block !important;
  min-height:16px !important;
  text-align:center !important;
  font-size:10px !important;
  line-height:1.1 !important;
}

#battleFinal .bf-name-row b{
  display:block !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}

#battleFinal .bf-hp .bar{
  width:100% !important;
  height:9px !important;
  overflow:hidden !important;
  background:#000 !important;
  border:1px solid #1c3853 !important;
  border-radius:5px !important;
}

#battleFinal .bf-hp .bar > div{
  width:100%;
  height:100% !important;
  background:linear-gradient(90deg,#00d66f,#00e5ff) !important;
  transition:width .25s ease !important;
}

#battleFinal .bf-hp-text{
  display:block !important;
  min-height:12px !important;
  text-align:center !important;
  font-size:8px !important;
  line-height:1.1 !important;
  white-space:nowrap !important;
}

#battleFinal .bf-sprite.s2.dead img{
  filter:grayscale(1) !important;
  opacity:.45 !important;
}

/* Nessun livello/statistica nel pannello superiore del fight. */
#battleFinal .bf-top .bf-stats,
#battleFinal .bf-top .poke-lv,
#battleFinal .bf-top .bf-level,
#battleFinal .bf-top .bf-atk,
#battleFinal .bf-top .bf-def,
#battleFinal .bf-top .bf-spd{
  display:none !important;
}
</style>

<style id="battleHpTextVisibilityFix">
#battleFinal .bf-hp-text{
  display:block !important;
  margin-top:1px !important;
  text-align:center !important;
  font-size:8px !important;
  line-height:1.1 !important;
  white-space:nowrap !important;
}
#battleFinal .bf-top .bar{
  display:block !important;
  width:100% !important;
  height:9px !important;
  overflow:hidden !important;
  background:#000 !important;
  border:1px solid #1c3853 !important;
  border-radius:5px !important;
}
#battleFinal .bf-top .bar > div{
  display:block !important;
  height:100% !important;
  min-width:0 !important;
  transition:width .25s ease !important;
}
</style>

<style id="bottomS1S2HpValueFix">
#hpTextSide,
#s2HpTxt{
  min-width:35px !important;
  font-size:8px !important;
  white-space:nowrap !important;
  text-align:right !important;
}
</style>

<style id="skillRerollResultStyle">
.skill-result-flow{
  display:grid;
  grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr);
  align-items:center;
  gap:6px;
  margin:12px 0;
}
.skill-result-old,
.skill-result-new{
  min-width:0;
}
.skill-result-old{
  border-color:#5b6780 !important;
}
.skill-result-new{
  border-color:#4cc3ff !important;
}
.skill-result-node .skill-arrow{
  text-align:center;
  font-size:22px;
  font-weight:900;
  color:#55d9ff;
}
</style>

<style id="bottomCenterQuickItems">
.b8-quick-items{
  width:100%;
  display:grid;
  grid-template-columns:repeat(5,minmax(0,1fr));
  gap:4px;
  margin-top:2px;
}

.b8-quick-item{
  min-width:0;
  height:34px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow:hidden;
  border:1px solid #315579;
  border-radius:6px;
  background:#071321;
  color:#fff;
}

.b8-quick-item.empty{
  opacity:.42;
}

.b8-quick-item .quick-item-icon{
  font-size:17px;
  line-height:1;
}

.b8-quick-item small{
  position:absolute;
  right:3px;
  bottom:2px;
  padding:0 2px;
  border-radius:3px;
  background:rgba(0,0,0,.65);
  color:#ffd43b;
  font-size:7px;
  font-weight:900;
  line-height:1;
}

@media (max-width:500px){
  .b8-quick-item{
    height:30px;
  }

  .b8-quick-item .quick-item-icon{
    font-size:15px;
  }

  .b8-quick-item small{
    font-size:6px;
  }
}
</style>

<style id="bottomQuickItemsFixedPosition">
/* Gli slot item del CENTER occupano sempre la stessa riga,
   indipendentemente dalla presenza/assenza di S2. */
#bottomContainer .b8-center{
  position:relative !important;
  padding-bottom:40px !important;
}

#bottomContainer .b8-quick-items{
  position:absolute !important;
  left:0 !important;
  right:0 !important;
  bottom:0 !important;
  width:100% !important;
  margin:0 !important;
  z-index:5 !important;
}
</style>

<style id="quickItemInteractiveStyle">
#bottomContainer .b8-quick-item:not(.empty){
  cursor:pointer !important;
  transition:
    border-color .15s ease,
    transform .15s ease,
    background .15s ease;
}
#bottomContainer .b8-quick-item:not(.empty):hover{
  border-color:#4cc3ff !important;
  background:#102840 !important;
  transform:translateY(-1px);
}
.quick-item-detail{
  max-width:320px;
}
.quick-item-detail-icon{
  font-size:46px;
  line-height:1;
  margin:4px 0 8px;
}
.quick-item-detail h2{
  margin:4px 0;
  color:#55d9ff;
  font-size:18px;
}
.quick-item-detail-rarity{
  margin-bottom:10px;
  color:#ffd43b;
  font-size:9px;
  font-weight:900;
  text-transform:uppercase;
}
.quick-item-detail-description{
  margin:10px 0 14px;
  padding:10px;
  border:1px solid rgba(49,85,121,.55);
  border-radius:8px;
  background:#071321;
  color:#dcecff;
  font-size:10px;
  line-height:1.35;
}
.quick-item-detail button{
  width:100%;
  margin-top:6px;
}
</style>
</head>
<body>
  <link rel="stylesheet" href="style.css">

  <!-- DATABASE MOSSE -->
  <!-- Deve essere caricata PRIMA di script.js -->
  <script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/DB_ITEMS.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/ITEM_SYSTEM_REGION_GITHUB.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/MOSSE_PKM.js"></script>

  <!-- =========================================================
       MENU PRINCIPALE
       ========================================================= -->

  <main id="menu">

    <h1>CORE v7 CLEAN</h1>

    <button onclick="start()">
      🎲 RUN RANDOM
    </button>

    <button onclick="start(25)">
      MEWTWO TEST
    </button>

  </main>

  <!-- =========================================================
       GAME
       ========================================================= -->

  <main id="game" class="hidden">

    <section id="gameBox">

      <!-- MAPPA -->

      <section class="map-wrap">

        <svg
          id="mapSvg"
          aria-hidden="true"
        ></svg>

        <div
          id="map"
          aria-label="Mappa della run"
        ></div>

      </section>

      <!-- HUD / BOTTOM PANEL -->

      <section id="bottomContainer"></section>

      <!-- EVENT LOG -->

      <div
        id="eventLog"
        aria-live="polite"
      ></div>

    </section>

  </main>

  <!-- =========================================================
       MODAL GENERALE
       ========================================================= -->

  <div
    id="modal"
    class="hidden"
    onclick="if(event.target.id==='modal') closeModal()"
  >
    <div id="modalContent"></div>
  </div>

  <!-- =========================================================
       POKÉMON PREVIEW
       ========================================================= -->

  <section
    id="pokePreview"
    class="hidden"
    aria-hidden="true"
  >

    <div class="pp-box">

      <!-- HEADER -->

      <div class="pp-top">

        <div class="pp-sprite-wrap">

          <img
            id="ppSprite"
            src=""
            alt="Pokémon"
          >

        </div>

        <div class="pp-info">

          <h3 id="ppName">-</h3>

          <span
            id="ppLevel"
            class="pp-lv"
          >
            LV 1
          </span>

          <div
            id="ppTypes"
            class="pp-types"
          ></div>

          <div class="pp-hp">

            <div
              id="ppHpFill"
              class="pp-fill"
            ></div>

          </div>

          <small id="ppHpText">
            0/0
          </small>

        </div>

        <button
          class="pp-close"
          onclick="closeTeamPreview()"
          aria-label="Chiudi"
        >
          ✕
        </button>

      </div>

      <!-- STATISTICHE -->

      <div class="pp-stats">

        <div>
          ATK
          <b id="ppk">0</b>
        </div>

        <div>
          DEF
          <b id="ppDef">0</b>
        </div>

        <div>
          SPD
          <b id="ppSpd">0</b>
        </div>

      </div>

      <!-- =======================================================
           INFO BOX / SKILL
           ======================================================= -->

      <div class="pp-custom">

        <h4>Info Box</h4>

        <div id="ppCustomContent">

          <div class="pp-skills">

            <div
              id="ppSkill"
              class="pp-skill-pill"
            >

              <span
                id="ppSkillName"
                class="pp-skill-name"
              >
                --
              </span>

              <span
                id="ppSkillPower"
                class="pp-skill-power"
              >
                PWR --
              </span>

            </div>

          </div>

          <div class="pp-actions">

            <button id="btnMossa">
              🔧 Mossa
            </button>

            <button class="danger">
              Rilascia
            </button>

          </div>

        </div>

      </div>

    </div>

  </section>

  <!-- =========================================================
       CORE
       ========================================================= -->

  <script src="script.js"></script>

  <!-- =========================================================
       FIX SKILL DB

       script.js contiene il sistema SkillSystem ma non chiama
       assignSkills() quando crea un Pokémon.

       Qui assegniamo le skill al Pokémon SOLO quando viene
       aperta la preview. La skill viene quindi generata una
       volta e salvata in p.skills.
       ========================================================= -->

  <script>

    /* ============================================================
   PokeMisteryRL - CORE v8.1 MODULAR
   Puoi collassare ogni #region e/o spostarla in un file separato
   ============================================================ */

const PokeMisteryRL = {};
// #region 01 - CONFIGURAZIONE + GLOBALI
PokeMisteryRL.Config = (() => {
  const SPRITE_BASE_URL = "https://cdn.jsdelivr.net/gh/ilGuru96/spritemon/";
  return { SPRITE_BASE_URL };
})();

// Stato globale condiviso
let PKM_RUN = null;
let busy = 0;
let timer = 0;
let mapResizeObserver = null;
let evoPromptShownFloor = -1;
const { SPRITE_BASE_URL } = PokeMisteryRL.Config;
// #endregion
// #region 02 - HELPER GENERALI
PokeMisteryRL.Helpers = (() => {
  const $ = id => document.getElementById(id);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const rand = arr => Array.isArray(arr) && arr.length? arr[Math.floor(Math.random() * arr.length)] : null;

  const sprite = (image) => {
    if (!image) return SPRITE_BASE_URL + "eevee.png";
    const v = String(image).trim();
    if (v.startsWith("http") || v.startsWith("data:")) return v;
    return SPRITE_BASE_URL + v;
  };
  const fmt = (n) => {
    n = Math.floor(Number(n) || 0);
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7? 0 : 1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4? 0 : 1) + "K";
    return n.toString();
  };
  const fmtIV = (v) =>!v? "" : v > 0? `+${v}` : `${v}`;
  const msg = (text) => {
    const el = $("eventLog");
    if (el) {
      el.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(() => el.textContent = "", 2000);
    }

    const logEl = $("runLogContent");
    if (logEl && text) {
      const line = document.createElement("div");
      line.className = "run-log-line";
      line.textContent = text;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    }
  };
const modal = (html) => {
  const content = $("modalContent"), box = $("modal");
  if (!content || !box) return;
  content.innerHTML = html;
  box.classList.remove("hidden");
};

const closeModal = () => $("modal")?.classList.add("hidden");

document.addEventListener("click", (e) => {
  const box = $("modal");

  if (!box || box.classList.contains("hidden")) return;

  if (e.target === box) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

const log = (text, cls = "") => {
  const el = $("blog");
  if (el) {
    el.innerHTML += `<div class="log-line ${cls}">${text}</div>`;
    el.scrollTop = el.scrollHeight;
  }

  const runLog = $("runLogContent");
  if (runLog && text) {
    const line = document.createElement("div");
    line.className = "run-log-line";
    line.textContent = String(text).replace(/<[^>]*>/g, "");
    runLog.appendChild(line);
    runLog.scrollTop = runLog.scrollHeight;
  }
};
  const ensureBoxStructure = () => {
    const gameBox = $("gameBox"), bottom = $("bottomContainer"), mapWrap = document.querySelector(".map-wrap");
    if (gameBox && bottom && mapWrap &&!gameBox.contains(bottom)) gameBox.appendChild(bottom);
  };
  return { $, clamp, rand, sprite, fmt, fmtIV, msg, modal, closeModal, log, ensureBoxStructure };
})();

const { $, clamp, rand, sprite, fmt, fmtIV, msg, modal, closeModal, log } = PokeMisteryRL.Helpers;
let runLogOpen = false;
const toggleRunLog = () => {
  runLogOpen = !runLogOpen;
  const content = $("runLogContent");
  const arrow = $("runLogArrow");
  if(content) content.style.display = runLogOpen ? "block" : "none";
  if(arrow) arrow.textContent = runLogOpen ? "▲" : "▼";
};

// #endregion
// #region 03 - TIPOLOGIE
PokeMisteryRL.Types = (() => {
  const TYPE_CHART = {
    normale:{}, fuoco:{erba:2,ghiaccio:2,coleottero:2,acciaio:2,fuoco:.5,acqua:.5,roccia:.5,drago:.5},
    acqua:{fuoco:2,terra:2,roccia:2,acqua:.5,erba:.5,drago:.5},
    erba:{acqua:2,terra:2,roccia:2,fuoco:.5,erba:.5,veleno:.5,volante:.5,coleottero:.5,drago:.5,acciaio:.5},
    elettro:{acqua:2,volante:2,erba:.5,elettro:.5,drago:.5,terra:0},
    ghiaccio:{erba:2,terra:2,volante:2,drago:2,fuoco:.5,acqua:.5,ghiaccio:.5,acciaio:.5},
    lotta:{normale:2,ghiaccio:2,roccia:2,buio:2,acciaio:2,veleno:.5,volante:.5,psico:.5,coleottero:.5,folletto:.5,spettro:0},
    veleno:{erba:2,folletto:2,veleno:.5,terra:.5,roccia:.5,spettro:.5,acciaio:0},
    terra:{fuoco:2,elettro:2,veleno:2,roccia:2,acciaio:2,erba:.5,coleottero:.5,volante:0},
    volante:{erba:2,lotta:2,coleottero:2,elettro:.5,roccia:.5,acciaio:.5},
    psico:{lotta:2,veleno:2,psico:.5,acciaio:.5,buio:0},
    coleottero:{erba:2,psico:2,buio:2,fuoco:.5,lotta:.5,volante:.5,spettro:.5,acciaio:.5,folletto:.5},
    roccia:{fuoco:2,ghiaccio:2,volante:2,coleottero:2,lotta:.5,terra:.5,acciaio:.5},
    spettro:{psico:2,spettro:2,buio:.5,normale:0},
    drago:{drago:2,acciaio:.5,folletto:0},
    buio:{psico:2,spettro:2,lotta:.5,buio:.5,folletto:.5},
    acciaio:{ghiaccio:2,roccia:2,folletto:2,fuoco:.5,acqua:.5,elettro:.5,acciaio:.5},
    folletto:{lotta:2,drago:2,buio:2,fuoco:.5,veleno:.5,acciaio:.5}
  };
  const getPokemonTypes = (p) =>!p? [] : Array.isArray(p.tipi)? p.tipi.map(t=>String(t).trim().toLowerCase()).filter(Boolean) : [];
  const getTypeMultiplier = (atkType, defTypes) => {
    if (!atkType ||!Array.isArray(defTypes)) return 1;
    const chart = TYPE_CHART[String(atkType).trim().toLowerCase()];
    if (!chart) return 1;
    return defTypes.reduce((m, t) => m * (chart[String(t).trim().toLowerCase()]?? 1), 1);
  };
  const getMultLabel = (m) => m===0? "INEFFICACE" : m>=2? "SUPEREFFICACE" : m<=0.5? "POCO EFFICACE" : "";
  const getTypingBadge = (type) => {
    const key = String(type||"").trim().toLowerCase(); if(!key) return "";
    const colors = {normale:"#d2d2bdff",fuoco:"#F08030",acqua:"#6890F0",erba:"#78C850",elettro:"#F8D030",ghiaccio:"#98D8D8",lotta:"#C03028",veleno:"#A040A0",terra:"#E0C068",volante:"#A890F0",psico:"#F85888",coleottero:"#A8B820",roccia:"#B8A038",spettro:"#705898",drago:"#7038F8",buio:"#705848",acciaio:"#B8B8D0",folletto:"#EE99AC"};
    return `<span class="type-badge type-${key}" style="background:${colors[key]||"#555"}">${key.toUpperCase()}</span>`;
  };
  return { TYPE_CHART, getPokemonTypes, getTypeMultiplier, getMultLabel, getTypingBadge };
})();
const { getPokemonTypes, getTypeMultiplier, getMultLabel, getTypingBadge } = PokeMisteryRL.Types;
// #endregion
// #region 04 - DATABASE POKEMON - LOADER FIX PER DB_PKM SENZA.js
PokeMisteryRL.Database = (() => {
  const PKM_DB = {};

  function normalizePokemonDatabase() {
    const source = window.PKM_ALL || window.DB_PKM || {};
    const flat = {};
    const addOne = (key, data) => {
      if (!data ||!data.id) return;
      flat[data.id] = {
        id: Number(data.id),
        nome: data.nome || data.name || key,
        immagine: sprite(data.immagine || data.image || (data.nome || "").toLowerCase() + ".png"),
        tipi: (data.tipi && data.tipi.length? data.tipi : data.types || []).map(t => String(t).toLowerCase()),
        stage: Number(data.stage || 1),
        bst: Number(data.bst || 300),
        evoluzione: data.evoluzione || data.evolution || null
      };
    };
    // se è { kanto: {1:{}} }
    if (source.kanto) {
      Object.entries(source.kanto).forEach(([k,v])=> addOne(k,v));
      if (source.johto) Object.entries(source.johto).forEach(([k,v])=> addOne(k,v));
    } else {
      Object.entries(source).forEach(([k,v])=> { if(v && v.id) addOne(k,v); });
    }
    return flat;
  }

  const buildPokemonDB = () => {
    Object.keys(PKM_DB).forEach(k => delete PKM_DB[k]);
    Object.assign(PKM_DB, normalizePokemonDatabase());
    console.log("PKM_DB:", Object.keys(PKM_DB).length + " Pokémon caricati");
    return PKM_DB;
  };

  const getPokemon = (id) => PKM_DB[Number(id)] || null;
  const getPokemonId = (value) => { var id=Number(value); return PKM_DB[id]? id : null; };

  // AUTO-LOAD DAL CDN - FIX PER NOME FILE SENZA.js
  async function loadRemoteDB() {
    if (Object.keys(window.PKM_ALL || {}).length > 10) { buildPokemonDB(); return; }
    try {
      var urls = [
        "https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/DB_PKM",
        "https://raw.githubusercontent.com/ilGuru96/PokeMisteryLike/main/DB_PKM"
      ];
      for (var u of urls) {
        var res = await fetch(u + "?t=" + Date.now());
        if (!res.ok) continue;
        var txt = await res.text();
        // il file è JS che definisce const PKM_ALL =...
        // lo eseguiamo in window
        var fn = new Function(txt + "\n; return typeof PKM_ALL!== 'undefined'? PKM_ALL : (typeof DB_PKM!== 'undefined'? DB_PKM : null);");
        var data = fn();
        if (data) {
          window.PKM_ALL = data.kanto? data.kanto : data;
          if (data.kanto && data.johto) window.PKM_ALL = {...data.kanto,...data.johto};
          buildPokemonDB();
          console.log("DB remoto caricato da", u);
          if (typeof buildStarterPool === 'function') buildStarterPool();
          if (window.PKM_RUN && window.PKM_RUN.team && window.PKM_RUN.team.length === 0) {
             if (typeof initGame === 'function') initGame();
          }
          if (typeof renderMenu === 'function') renderMenu();
          if (typeof render === 'function') render();

          return;
        }
      }
    } catch(e) { console.error("DB load fallito", e); }
  }

  loadRemoteDB();

  return { PKM_DB, buildPokemonDB, getPokemon, getPokemonId, loadRemoteDB };
})();

const { PKM_DB, buildPokemonDB, getPokemon, getPokemonId } = PokeMisteryRL.Database;
// #endregion
// #region 05 - STATISTICHE / ISTANZE
  PokeMisteryRL.Stats = (() => {
  const getStatsFromBST = (bst, stage=1) => {
    bst = Math.max(1, Number(bst)||1);
    const factor = stage===1?0.92:stage===2?1:stage===3?1.05:1.08;
    const total = bst * factor;
    return { hp:Math.max(1,Math.floor(total*0.30)), atk:Math.max(1,Math.floor(total*0.18)), satk:Math.max(1,Math.floor(total*0.18)), dif:Math.max(1,Math.floor(total*0.19)), spd:Math.max(1,Math.floor(total*0.15)) };
  };
  const rollPokemonStats = () => ({ atk:Math.floor(Math.random()*7)-3, satk:Math.floor(Math.random()*7)-3, dif:Math.floor(Math.random()*7)-3, spd:Math.floor(Math.random()*7)-3 });
  const createPokemonInstance = (id) => {
    const base = getPokemon(id); if(!base) return null;
    const stats = getStatsFromBST(base.bst, base.stage); const rolls = rollPokemonStats();
    const finalStats = { hp:stats.hp, atk:Math.max(1,stats.atk+rolls.atk), satk:Math.max(1,stats.satk+rolls.satk), dif:Math.max(1,stats.dif+rolls.dif), spd:Math.max(1,stats.spd+rolls.spd) };
    const pokemon = {
      id:base.id,
      nome:base.nome,
      immagine:base.immagine,
      tipi:[...base.tipi],
      stage:base.stage,
      bst:base.bst,
      stats:finalStats,
      rolls,
      crit:0,
      stun:0,
      eva:0,
      level:1,
      sk:1,
      fame:100,
      hp:finalStats.hp,
      maxHp:finalStats.hp
    };

    // Il SkillSystem viene definito più avanti nel file, ma questa
    // funzione viene eseguita solo dopo il caricamento completo del JS.
    if (
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.assignSkills === "function"
    ) {
      PokeMisteryRL_SkillSystem.assignSkills(pokemon);
    }

    return pokemon;
  };
  const getActivePokemon = () => PKM_RUN?.activePokemon || null;
  const getFinalStats = () => { const p=getActivePokemon(); return p? {...p.stats} : {hp:0,atk:0,satk:0,dif:0,spd:0}; };
  const getD = () => { const p=getActivePokemon(); if(!p) return {nome:"-",immagine:"",typing:"Normale",stage:1}; return {nome:p.nome, immagine:p.immagine, typing:p.tipi.join("/"), stage:p.stage}; };
  return { getStatsFromBST, createPokemonInstance, getActivePokemon, getFinalStats, getD };
})();
const { getStatsFromBST, createPokemonInstance, getActivePokemon, getFinalStats, getD } = PokeMisteryRL.Stats;
// #endregion
// #region 06 - LEVEL SYSTEM - AUTONOMO - FINAL


</script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/LEVEL_SYSTEM_REGION.js"></script>
<script>
;

window.PokeMisteryRL_LevelSystem = PokeMisteryRL_LevelSystem;

// #endregion
// #region 07 - STATO RUN
PokeMisteryRL.Run = (() => {
const createRunState = (starter) => ({
    mode:"torre",
    activePokemon:starter, // STARTER1 FISSO - NON SI TOCCA MAI
    secondActive: null, // STARTER2 - quello che combatte e si cambia
    originPokemon:starter.id,
    level:starter.level, sk:starter.sk,
    floor:1, row:0, col:0, hp:starter.hp, maxHp:starter.maxHp, fame:starter.fame, bits:200,
    teamSlots:[null,null,null], map:[], battle:null, dead:false,
    inventory:[], eggs:[], incubator:{active:false, steps:0, total:0},
    effects:{ enemyBuff:1, nextEnemyDebuff:1, bossDebuff:1, mirror:false, swapStats:false }
  });
  const buildRunSkeleton = () => {
    clearTimeout(timer);
    if(mapResizeObserver){ mapResizeObserver.disconnect(); mapResizeObserver=null; }
    PKM_RUN=null; busy=0; evoPromptShownFloor=-1;
    $("modal")?.classList.add("hidden");
    if($("eventLog")) $("eventLog").textContent="";
    if($("mapSvg")) $("mapSvg").innerHTML="";
    if($("map")) $("map").innerHTML="";
    if($("bottomContainer")) $("bottomContainer").innerHTML = PokeMisteryRL.UI.buildBottomPanelTemplate();
  };
  const startPokemon = (pokemonId=null, modeName="torre") => {
    buildRunSkeleton(); buildPokemonDB();
    const available = Object.values(PKM_DB);
    if(!available.length){ console.error("PKM_ALL vuoto"); return; }
    const selectedId = getPokemonId(pokemonId)?? rand(available)?.id;
    const starter = createPokemonInstance(selectedId); if(!starter) return;
    starter.level = 5;
    starter.sk = Math.max(1, Number(starter.sk) || 1);
    PKM_RUN = createRunState(starter); PKM_RUN.mode = modeName;
    $("menu")?.classList.add("hidden"); $("game")?.classList.remove("hidden");
    PokeMisteryRL.Map.buildMap(); PokeMisteryRL.UI.render();
    const rolls = Object.entries(starter.rolls).filter(([,v])=>v!==0).map(([k,v])=>`${k.toUpperCase()} ${fmtIV(v)}`).join(" ");
    msg(`${starter.nome} pronto! ${rolls}`);
  };
  const quickReset = () => { if(busy) return; startPokemon(PKM_RUN?.originPokemon, PKM_RUN?.mode||"torre"); };
  const goMenu = () => { clearTimeout(timer); if(PKM_RUN?.battle) PKM_RUN.battle=null; $("modal")?.classList.add("hidden"); $("game")?.classList.add("hidden"); $("menu")?.classList.remove("hidden"); };
  return { createRunState, buildRunSkeleton, startPokemon, quickReset, goMenu };
})();
// #endregion
// #region 08 - TEAM | 09 - CATTURA | 10 - EVOLUZIONI


</script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/TEAM_SYSTEM_REGION.js"></script>
<script>
;



PokeMisteryRL.TeamRoster = (() => {

  const getFreeSlot = () =>
    !PKM_RUN?.teamSlots
      ? -1
      : PKM_RUN.teamSlots.findIndex(s => !s);

  const renderTeamSlots = () => {
    if(!PKM_RUN?.teamSlots) return;

    PKM_RUN.teamSlots.forEach((p, i) => {
      const el = $(`teamSlot${i}`);
      if(!el) return;

      if(!p){
        el.innerHTML = "+";
        el.classList.remove("filled");
        return;
      }

      el.classList.add("filled");
      el.innerHTML = `<img src="${sprite(p.immagine)}">`;
    });

    const s2 = $("starter2Slot");
    if(s2){
      const p2 = PKM_RUN.secondActive;
      if(!p2){
        s2.innerHTML = "+ S2";
        s2.classList.remove("filled");
      }else{
        s2.innerHTML = `<img src="${sprite(p2.immagine)}">`;
        s2.classList.add("filled");
      }
    }
  };

  const swapToActive = () => {
    msg("Starter1 fisso! Usa S2");
  };

  const equipAsSecond = (i) => {

    if(!PKM_RUN){
      return false;
    }

    const index =
      Number(i);

    if(
      !Number.isInteger(index) ||
      index < 0
    ){
      return false;
    }

    const team =
      PKM_RUN.teamSlots || [];

    const selected =
      team[index];

    if(!selected){
      return false;
    }

    const oldS2 =
      PKM_RUN.secondActive || null;

    /*
     * Cambio diretto:
     * riserva[index] <-> S2.
     */
    PKM_RUN.secondActive =
      selected;

    team[index] =
      oldS2;

    PKM_RUN.teamSlots =
      team;

    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();

    /*
     * Dopo la selezione chiudi automaticamente la schermata S2.
     * Non aprire anteprime o statistiche.
     */
    if(typeof closeTeamPreview === "function"){
      closeTeamPreview();
    }else if(typeof closePokeInfo === "function"){
      closePokeInfo();
    }else if(typeof closeModal === "function"){
      closeModal();
    }

    busy = 0;

    /*
     * NON aprire:
     * - openTeamPreview
     * - openPokeInfo
     * - openSecondPreview
     *
     * Il click serve solo a selezionare il nuovo S2.
     */
    return true;
  };


const unequipSecond = () => {
    if(!PKM_RUN?.secondActive) return;

    const slot = getFreeSlot();
    if(slot < 0){
      msg("Squadra piena");
      return;
    }

    PKM_RUN.teamSlots[slot] = PKM_RUN.secondActive;
    PKM_RUN.secondActive = null;
    closeTeamPreview();
    render();
  };

  const releaseSecond = () => {
    if(!PKM_RUN) return;
    PKM_RUN.secondActive = null;
    closeTeamPreview();
    render();
  };

  const releasePoke = (i) => {
    if(!PKM_RUN?.teamSlots) return;
    PKM_RUN.teamSlots[i] = null;
    closeTeamPreview();
    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();
  };

  // Prepara il Pokémon sconfitto per il reclutamento.
  // La cattura è sempre al 100%: l'unica scelta del giocatore è ACCETTARE o RIFIUTARE.
  const prepareRecruitment = (
    enemy
  ) => {

    if(!enemy || !PKM_RUN){
      return null;
    }

    /*
     * Crea una nuova istanza solo per mantenere i dati strutturali
     * del Pokémon (id, sprite, typing, ecc.).
     */
    const captured =
      createPokemonInstance(enemy.id);

    if(!captured){
      return null;
    }

    /*
     * LIVELLO:
     * usa il livello reale dell'incontro, non quello dello starter
     * e non un valore calcolato dopo la vittoria.
     */
    const encounterLevel =
      Math.max(
        1,
        Number(enemy.level) ||
        Number(PKM_RUN.floor) + 2
      );

    captured.level =
      encounterLevel;

    /*
     * STATISTICHE:
     * il reclutato eredita quelle effettivamente usate nel fight.
     */
    if(enemy.stats){

      captured.stats = {
        hp: Number(enemy.stats.hp) || 1,
        atk: Number(enemy.stats.atk) || 1,
        satk: Number(enemy.stats.satk) || 1,
        dif: Number(enemy.stats.dif) || 1,
        spd: Number(enemy.stats.spd) || 1
      };

      captured.maxHp =
        Number(enemy.maxHp) ||
        captured.stats.hp ||
        1;

      captured.hp =
        captured.maxHp;
    }

    captured.id =
      enemy.id;

    captured.nome =
      enemy.nome;

    captured.immagine =
      enemy.immagine;

    captured.tipi =
      [...(enemy.tipi || captured.tipi || [])];

    captured.stage =
      enemy.stage ??
      captured.stage;

    captured.bst =
      enemy.bst ??
      captured.bst;

    return captured;
  };

  // Inserisce il nuovo Pokémon nella prima posizione disponibile.
  // Ordine: 3 slot riserva -> S2 se ancora libero.

  const replacePokemon = (
    target,
    pokemon
  ) => {

    if(!PKM_RUN || !pokemon){
      return false;
    }

    if(target === "s2"){

      if(!PKM_RUN.secondActive){
        return false;
      }

      PKM_RUN.secondActive = pokemon;

      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();

      return true;
    }

    const index =
      Number(target);

    if(
      !Number.isInteger(index) ||
      index < 0 ||
      index >= 3
    ){
      return false;
    }

    if(!PKM_RUN.teamSlots?.[index]){
      return false;
    }

    PKM_RUN.teamSlots[index] = pokemon;

    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();

    return true;
  };


  const recruitPokemon = (pokemon) => {
    if(!pokemon || !PKM_RUN) return false;

    const slot = getFreeSlot();
    if(slot >= 0){
      PKM_RUN.teamSlots[slot] = pokemon;
      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();
      return true;
    }

    // FIX: quando i 3 slot riserva sono pieni ma S2 è vuoto,
    // il quinto Pokémon deve poter entrare come Starter 2.
    if(!PKM_RUN.secondActive){
      PKM_RUN.secondActive = pokemon;
      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();
      return true;
    }

    return false;
  };

  return {
    replacePokemon,
    getFreeSlot,
    renderTeamSlots,
    swapToActive,
    releasePoke,
    equipAsSecond,
    unequipSecond,
    releaseSecond,
    prepareRecruitment,
    recruitPokemon
  };

})();



PokeMisteryRL.Evo = (() => {

  const getEvolutionTarget = (
    id = getActivePokemon()?.id
  ) => {

    const p = getPokemon(id);

    if(!p) return null;

    const e = p.evoluzione;

    if(!e) return null;

    return getPokemonId(
      e.out ?? e.a ?? e.to
    );
  };


  const getSecondActive = () =>
    PKM_RUN?.secondActive || null;


  const getFixedStarter = () =>
    PKM_RUN?.activePokemon || null; // STARTER1


  const checkEvolutionCondition = () => {

    const a = getActivePokemon();

    if(!a) return false;

    const p = getPokemon(a.id);

    if(!p?.evoluzione) return false;

    const t = getEvolutionTarget(a.id);

    if(!t) return false;

    const req = Number(p.evoluzione.lv ?? 0);

    if(req > 0 && a.level < req)
      return false;

    return true;
  };


  const canEvolve = () => {

    if(!PKM_RUN)
      return false;

    if(evoPromptShownFloor === PKM_RUN.floor)
      return false;

    return checkEvolutionCondition();
  };


  const checkEvolve = () => {

    if(!canEvolve())
      return false;

    showEvolutionPrompt();

    return true;
  };


  const showEvolutionPrompt = () => {

    const targetId = getEvolutionTarget();

    if(!targetId) return;

    const target = getPokemon(targetId);
    const active = getActivePokemon();

    if(!target || !active) return;

    evoPromptShownFloor = PKM_RUN.floor;

    busy = 1;

    modal(`
      <div class="center s2-no-companion-modal">

        <h2>⭐ EVOLUZIONE ⭐</h2>

        <p>${active.nome} può evolvere!</p>

        <button onclick="evolvePokemon(${target.id})">

          <img
            src="${sprite(target.immagine)}"
            style="width:48px;height:48px;image-rendering:pixelated"
          >

          <br>

          ${target.nome}

        </button>

        <button onclick="closeEvolutionPrompt()">
          RIMANDA
        </button>

      </div>
    `);
  };


  const closeEvolutionPrompt = () => {

    closeModal();

    busy = 0;

    PokeMisteryRL.UI.render();
  };


  const evolvePokemon = (newId) => {

    const active = getActivePokemon();
    const old = getPokemon(active?.id);
    const target = getPokemon(newId);

    if(!active || !target)
      return;

    active.id = target.id;
    active.nome = target.nome;
    active.immagine = target.immagine;
    active.tipi = [...target.tipi];
    active.stage = target.stage;
    active.bst = target.bst;

    // Dopo l'evoluzione il typing può cambiare: rigenera le skill
    // in base al nuovo Pokémon.
    if (
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.assignSkills === "function"
    ) {
      PokeMisteryRL_SkillSystem.assignSkills(active);
    }

    PokeMisteryRL_LevelSystem.rebuildBaseStats(active);

    active.hp = active.maxHp;

    closeModal();
    busy = 0;
    PokeMisteryRL.UI.render();
    msg(`◈ ${old?.nome||"Pokémon"} → ${target.nome} ◈`);
  };


  return {
    getEvolutionTarget,
    canEvolve,
    checkEvolve,
    showEvolutionPrompt,
    closeEvolutionPrompt,
    evolvePokemon
  };

})();



const {
  getCombinedTeam,
  getTeamStats
} = PokeMisteryRL.Team;


const {
  getFreeSlot,
  renderTeamSlots,
  swapToActive,
  releasePoke,
  equipAsSecond,
  unequipSecond,
  releaseSecond,
  captureDefeatedPokemon
} = PokeMisteryRL.TeamRoster;


const {
  getEvolutionTarget,
  checkEvolve,
  evolvePokemon,
  closeEvolutionPrompt
} = PokeMisteryRL.Evo;



window.closeTeamPreview = () => {
  $("pokePreview")?.classList.add("hidden");
};



const fillPreview = (p, customHTML = "") => {

  $("ppSprite").src =
    typeof sprite === 'function'
      ? sprite(p.immagine)
      : p.immagine;

  $("ppName").textContent = p.nome;

  $("ppLevel").textContent =
    `LV ${p.level}`;

  $("ppTypes").innerHTML =
    (p.tipi || [])
      .map(t => `<span class="type-badge type-${t}">${t}</span>`)
      .join('');

  const hpPerc =
    Math.floor((p.hp / p.maxHp) * 100);

  $("ppHpFill").style.width =
    hpPerc + "%";

  $("ppHpText").textContent =
    `${p.hp}/${p.maxHp}`;

  $("ppk").textContent =
    p.stats.atk;

  $("ppDef").textContent =
    p.stats.dif;

  $("ppSpd").textContent =
    p.stats.spd;

  // FIX SKILL DB:
  // assegna le skill al Pokémon la prima volta che viene
  // aperta la preview, senza rigenerarle alle aperture successive.
  if (
    p &&
    typeof PokeMisteryRL_SkillSystem !== "undefined" &&
    typeof PokeMisteryRL_SkillSystem.assignSkills === "function" &&
    (!Array.isArray(p.skills) || p.skills.length === 0)
  ) {
    PokeMisteryRL_SkillSystem.assignSkills(p);
  }

const skill =
  typeof PokeMisteryRL_SkillSystem !== "undefined"
    ? PokeMisteryRL_SkillSystem.getPokemonSkill(
        p,
        Number(p.sk) || 1
      )
    : null;

  $("ppCustomContent").innerHTML = `
    <div class="pp-skills">
      <div id="ppSkill" class="pp-skill-pill">
        <span id="ppSkillName" class="pp-skill-name">
          ${skill?.name || "--"}
        </span>

        <span id="ppSkillPower" class="pp-skill-power">
          PWR ${skill?.pwr ?? "--"}
        </span>
      </div>
    </div>

    ${customHTML}
  `;

  $("pokePreview").classList.remove("hidden");
};






// #endregion
// #region 11 - MAPPA | 11 - PROGRESSIONE
PokeMisteryRL.Map = (() => {
  const buildMap = () => {
    // Ogni riga ha un numero diverso di nodi rispetto alla successiva.
    // La struttura è fissa per evitare righe consecutive uguali.
    // Riga 0 = 1 nodo di partenza, con ESATTAMENTE 3 uscite verso la riga 1.
    const layout = [1, 3, 4, 5, 3, 2, 1];
    PKM_RUN.map = [];

    for (let r = 0; r < layout.length; r++) {
      const cols = layout[r];
      const row = [];

      for (let c = 0; c < cols; c++) {
        let type = "free";

        if (r === 0) {
          type = "free";
        } else if (r === layout.length - 1) {
          type = "boss";
        } else if (r === layout.length - 2) {
          type = c === 0 ? "rifugio" : rand(["fight", "shop", "skill", "event"]);
        } else {
          const rnd = Math.random();
          type = rnd < 0.45 ? "fight"
               : rnd < 0.65 ? "shop"
               : rnd < 0.80 ? "skill"
               : rnd < 0.90 ? "rifugio"
               : "event";
        }

        const node = {
          id: `r${r}c${c}`,
          row: r,
          col: c,
          type,
          ok: r === 0,
          done: false,
          kid: []
        };

        // Per ogni nodo fight/boss scegliamo subito il Pokémon da mostrare.
        // Usiamo solo PKM_DB, che è già disponibile nel CORE.
        if(type === "fight" || type === "boss"){

          const enemyStage =
            type === "boss"
              ? (PKM_RUN.floor < 3 ? 1 : PKM_RUN.floor < 6 ? 2 : 3)
              : (PKM_RUN.floor < 2 ? 1 : PKM_RUN.floor < 5 ? 2 : 3);

          const candidates =
            Object.values(PKM_DB).filter(
              p => Number(p.stage) === Number(enemyStage)
            );

          if(candidates.length){
            const chosen = rand(candidates);

            node.enemyPreview = {
              id: chosen.id,
              nome: chosen.nome,
              immagine: chosen.immagine,
              stage: Number(chosen.stage)
            };
          }
        }

        row.push(node);
      }

      PKM_RUN.map.push(row);
    }

    // Crea i collegamenti senza mai duplicare una scelta nella stessa riga.
    // Per ogni nodo vengono usate solo colonne realmente esistenti.
    for (let r = 0; r < PKM_RUN.map.length - 1; r++) {
      const cur = PKM_RUN.map[r];
      const nxt = PKM_RUN.map[r + 1];

      cur.forEach((node) => {
        const choices = new Set();

        // Caso speciale: il primo nodo deve avere sempre tutte e 3 le uscite.
        if (r === 0) {
          for (let c = 0; c < nxt.length; c++) choices.add(c);
        } else {
          const ratio = nxt.length / cur.length;
          const center = Math.round(node.col * ratio);

          // Centro + vicini: massimo 3 scelte, tutte uniche.
          [center - 1, center, center + 1].forEach((c) => {
            if (c >= 0 && c < nxt.length) choices.add(c);
          });

          // Protezione per eventuali configurazioni future con una sola colonna.
          if (!choices.size) choices.add(Math.min(node.col, nxt.length - 1));
        }

        node.kid = [...choices];
      });
    }

    // La riga 1 deve presentare 3 scelte distinte e non duplicare mai lo stesso nodo.
    // I nodi sono identificati dalla loro colonna, quindi Set/kid garantisce l'unicità.
  };
  const drawMapLines = () => {
    const svg=$("mapSvg"), map=$("map"); if(!svg||!map||!PKM_RUN?.map?.length) return; svg.innerHTML=""; const rect=map.getBoundingClientRect(); svg.style.left=map.offsetLeft+"px"; svg.style.top=map.offsetTop+"px"; svg.style.width=map.offsetWidth+"px"; svg.style.height=map.offsetHeight+"px"; svg.setAttribute("width",map.offsetWidth); svg.setAttribute("height",map.offsetHeight); svg.setAttribute("viewBox",`0 0 ${map.offsetWidth} ${map.offsetHeight}`);
    PKM_RUN.map.forEach(row=>{ row.forEach(node=>{ const from=$(`n-${node.id}`); if(!from)return; node.kid.forEach(childCol=>{ const child=PKM_RUN.map[node.row+1]?.find(i=>i.col===childCol); if(!child)return; const to=$(`n-${child.id}`); if(!to)return; const a=from.getBoundingClientRect(), b=to.getBoundingClientRect(); const cx1=a.left-rect.left+a.width/2, cy1=a.top-rect.top+a.height/2, cx2=b.left-rect.left+b.width/2, cy2=b.top-rect.top+b.height/2; const dx=cx2-cx1, dy=cy2-cy1, dist=Math.hypot(dx,dy); if(!dist)return; const nx=dx/dist, ny=dy/dist; const line=document.createElementNS("http://www.w3.org/2000/svg","line"); line.setAttribute("x1",cx1+nx*a.width/2); line.setAttribute("y1",cy1+ny*a.height/2); line.setAttribute("x2",cx2-nx*b.width/2); line.setAttribute("y2",cy2-ny*b.height/2); line.classList.add("map-line"); const isCurrent=node.row===PKM_RUN.row && node.col===PKM_RUN.col && child.ok; line.classList.add(isCurrent?"available":"done"); svg.appendChild(line); }); }); });
  };
  return { buildMap, drawMapLines };
})();
PokeMisteryRL.Progress = (() => {
  const pick = (node) => {
    if(busy||!node?.ok||PKM_RUN?.dead) return; busy=1;
    const real=PKM_RUN.map[node.row]?.[node.col]; if(!real||!real.ok){busy=0;return;}
    real.done=true; PKM_RUN.map.forEach(r=>r.forEach(n=>n.ok=false)); PKM_RUN.row=node.row; PKM_RUN.col=node.col; PokeMisteryRL.UI.render();
    switch(real.type){ case "free": next(); break; case "fight": typeof fight==="function"?fight(false):next(); break; case "boss": typeof fight==="function"?fight(true):next(); break; case "skill": skill(); break; case "shop": shop(); break; case "rifugio": rifugio(); break; case "event": eggEvent(); break; default: next(); break; }
  };
  const next = (message="") => {
    if(!PKM_RUN)return; const current=PKM_RUN.map[PKM_RUN.row]?.[PKM_RUN.col]; if(!current)return;
    if(current.type==="boss"){ PKM_RUN.floor++; const a=getActivePokemon(); if(a){a.hp=a.maxHp; PKM_RUN.hp=a.maxHp;} PokeMisteryRL.Map.buildMap(); PKM_RUN.row=0; PKM_RUN.col=0; PKM_RUN.map[0][0].ok=true; }
    else { PKM_RUN.map.forEach(r=>r.forEach(n=>n.ok=false)); const nextRow=PKM_RUN.map[PKM_RUN.row+1]; if(nextRow){ current.kid.forEach(c=>{ if(nextRow[c]) nextRow[c].ok=true; }); if(!nextRow.some(n=>n.ok)) nextRow.forEach(n=>n.ok=true); PKM_RUN.row++; const first=nextRow.find(n=>n.ok); if(first) PKM_RUN.col=first.col; } }
    if(message) msg(message); closeModal(); busy=0; PokeMisteryRL.UI.render(); checkEvolve();
  };
  return { pick, next };
})();
const { pick, next } = PokeMisteryRL.Progress;
// #endregion
// #region 12 - FELICITA / SKILL / RIFUGIO | 13 - SHOP / EVENTI / UI
PokeMisteryRL.Effects = (() => {
  const updateHPBar = () => {

    const a =
      getActivePokemon();

    if(!a){
      return;
    }

    const maxHp =
      Math.max(
        1,
        Number(a.maxHp) || 1
      );

    const hp =
      clamp(
        Number(a.hp) || 0,
        0,
        maxHp
      );

    const percent =
      hp / maxHp * 100;

    const bar =
      $("hpFillSide");

    if(bar){
      bar.style.width =
        percent + "%";
    }

    const text =
      $("hpTextSide");

    if(text){
      text.textContent =
        `HP ${hp}/${maxHp}`;
    }

  };
  const addFel = (v) => { const a=getActivePokemon(); if(!a)return; const old=a.fel; a.fel=clamp(a.fel+Number(v||0),0,100); PKM_RUN.fel=a.fel; if(old<100&&a.fel>=100) msg("FEL 100!"); PokeMisteryRL.UI.refreshBottomPanel(); };
  const consumeFel = (v) => { const a=getActivePokemon(); if(!a||a.fel<v)return false; a.fel-=v; PKM_RUN.fel=a.fel; PokeMisteryRL.UI.refreshBottomPanel(); return true; };
  const getSkillPreview = (
    pokemon,
    level
  ) => {

    if(!pokemon){
      return null;
    }

    const currentLevel =
      Number(pokemon.sk) || 1;

    /*
     * Skill attualmente equipaggiata:
     * usa sempre quella realmente salvata nel Pokémon.
     */
    if(
      Number(level) === currentLevel &&
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.getActiveSkill === "function"
    ){
      return (
        PokeMisteryRL_SkillSystem.getActiveSkill(
          pokemon
        ) || null
      );
    }

    /*
     * Skill futura:
     * la memorizziamo solo sul Pokémon.
     * Nessuna modifica a PKM_RUN o alla procedura di start.
     */
    if(!Array.isArray(pokemon.__skillPreview)){
      pokemon.__skillPreview = [];
    }

    const cached =
      pokemon.__skillPreview.find(
        item =>
          Number(item.level) === Number(level)
      );

    if(cached){
      return cached.skill;
    }

    if(
      typeof PokeMisteryRL_SkillSystem === "undefined" ||
      typeof PokeMisteryRL_SkillSystem.getSkill !== "function"
    ){
      return null;
    }

    const skill =
      PokeMisteryRL_SkillSystem.getSkill(
        pokemon,
        Number(level)
      );

    if(!skill){
      return null;
    }

    pokemon.__skillPreview.push({
      level: Number(level),
      skill
    });

    return skill;
  };


  const upgradeSkillTarget = (
    target
  ) => {

    const pokemon =
      target === "s2"
        ? PKM_RUN?.secondActive
        : getActivePokemon();

    if(!pokemon){
      msg(
        target === "s2"
          ? "S2 non equipaggiato."
          : "S1 non disponibile."
      );
      return false;
    }

    const currentLevel =
      Number(pokemon.sk) || 1;

    if(currentLevel >= 3){
      msg(
        `${pokemon.nome}: SKILL MAX`
      );
      return false;
    }

    const nextLevel =
      currentLevel + 1;

    const selected =
      getSkillPreview(
        pokemon,
        nextLevel
      );

    if(!selected){
      msg(
        `Nessuna skill LV ${nextLevel} disponibile.`
      );
      return false;
    }

    /*
     * Applica esattamente la skill visualizzata.
     */
    pokemon.skills =
      [selected];

    pokemon.sk =
      nextLevel;

    if(target === "s1"){
      PKM_RUN.sk =
        pokemon.sk;
    }

    PokeMisteryRL.UI.refreshBottomPanel();

    msg(
      `${pokemon.nome}: ${selected.name || selected.nome}`
    );

    return true;
  };


  const upgradeSkill = () =>
    upgradeSkillTarget("s1");


  

const getCurrentSkillNode = () => {

  return (
    PKM_RUN?.map?.[PKM_RUN.row]?.[PKM_RUN.col] ||
    null
  );
};


const isSkillRerollAvailable = () => {

  const node =
    getCurrentSkillNode();

  return (
    node?.type === "skill" &&
    node.rerollUsed !== true
  );
};


const consumeSkillReroll = () => {

  const node =
    getCurrentSkillNode();

  if(
    node &&
    node.type === "skill"
  ){
    node.rerollUsed = true;
  }
};


const showSkillRerollResult = (
  pokemon,
  oldSkill,
  newSkill
) => {

  const oldName =
    oldSkill?.name ||
    oldSkill?.nome ||
    "--";

  const newName =
    newSkill?.name ||
    newSkill?.nome ||
    "--";

  const oldPower =
    oldSkill?.pwr ??
    oldSkill?.power ??
    "--";

  const newPower =
    newSkill?.pwr ??
    newSkill?.power ??
    "--";

  modal(`
    <div class="center skill-result-node">

      <h2>
        🔄 REROLL SKILL
      </h2>

      <p class="skill-node-subtitle">
        La skill di ${pokemon.nome} è cambiata.
      </p>

      <div class="skill-result-flow">

        <div class="skill-move-box skill-result-old">

          <small>
            PRIMA
          </small>

          <strong>
            ${oldName}
          </strong>

          <span>
            PWR ${oldPower}
          </span>

        </div>

        <div class="skill-arrow">
          →
        </div>

        <div class="skill-move-box skill-result-new">

          <small>
            DOPO
          </small>

          <strong>
            ${newName}
          </strong>

          <span>
            PWR ${newPower}
          </span>

        </div>

      </div>

      <button
        type="button"
        onclick="next()"
      >
        CONTINUA
      </button>

    </div>
  `);
};


const rerollSkillTarget = (
  target
) => {

  const pokemon =
    target === "s2"
      ? PKM_RUN?.secondActive
      : getActivePokemon();

  if(!pokemon){
    msg(
      target === "s2"
        ? "S2 non equipaggiato."
        : "S1 non disponibile."
    );
    return false;
  }

  const currentLevel =
    Number(pokemon.sk) || 1;

  /*
   * Un solo reroll per nodo Skill.
   */
  if(!isSkillRerollAvailable()){
    msg(
      "Reroll già usato in questo nodo Skill."
    );
    return false;
  }

  /*
   * Il reroll è disponibile solo a LV3.
   */
  if(currentLevel !== 3){
    msg(
      "Il reroll è disponibile solo a SKILL LV3."
    );
    return false;
  }

  const COST =
    50;

  if(
    Number(PKM_RUN.bits) < COST
  ){
    msg(
      `Servono ${COST} monete.`
    );
    return false;
  }

  if(
    typeof PokeMisteryRL_SkillSystem === "undefined" ||
    typeof PokeMisteryRL_SkillSystem.getSkill !== "function"
  ){
    msg(
      "Skill System non disponibile."
    );
    return false;
  }

  const oldSkill =
    PokeMisteryRL_SkillSystem.getActiveSkill(
      pokemon
    );

  /*
   * Una sola estrazione della nuova skill LV3.
   */
  const newSkill =
    PokeMisteryRL_SkillSystem.getSkill(
      pokemon,
      currentLevel
    );

  if(!newSkill){
    msg(
      "Nessuna skill LV3 disponibile."
    );
    return false;
  }

  /*
   * Applica prima la nuova skill e poi consuma il reroll.
   */
  pokemon.skills =
    [newSkill];

  pokemon.sk =
    currentLevel;

  PKM_RUN.bits =
    Math.max(
      0,
      Number(PKM_RUN.bits) - COST
    );

  consumeSkillReroll();

  /*
   * Elimina la preview precedente LV3,
   * così la prossima visita del sistema usa lo stato reale.
   */
  if(
    Array.isArray(pokemon.__skillPreview)
  ){
    pokemon.__skillPreview =
      pokemon.__skillPreview.filter(
        item =>
          Number(item.level) !== currentLevel
      );
  }

  PokeMisteryRL.UI.refreshBottomPanel();

  /*
   * Mostra il confronto prima di chiudere il nodo.
   * CONTINUA usa next(), esattamente come il potenziamento.
   */
  showSkillRerollResult(
    pokemon,
    oldSkill,
    newSkill
  );

  return true;
};


const buildSkillCard = (
  target,
  pokemon
) => {

  if(!pokemon){

    return `
      <div class="skill-choice-card skill-choice-empty">

        <div class="skill-choice-head">
          <b>${target}</b>
          <span>S2 NON EQUIPAGGIATO</span>
        </div>

      </div>
    `;
  }

  const level =
    Number(pokemon.sk) || 1;

  const nextLevel =
    level + 1;

  const rerollAvailable =
    isSkillRerollAvailable();

  const currentSkill =
    getSkillPreview(
      pokemon,
      level
    );

  const nextSkill =
    level < 3
      ? getSkillPreview(
          pokemon,
          nextLevel
        )
      : null;

  const currentName =
    currentSkill?.name ||
    currentSkill?.nome ||
    "--";

  const nextName =
    nextSkill?.name ||
    nextSkill?.nome ||
    "MAX";

  const currentPower =
    currentSkill?.pwr ??
    currentSkill?.power ??
    "--";

  const nextPower =
    nextSkill?.pwr ??
    nextSkill?.power ??
    "--";

  const action =
    level === 3 && rerollAvailable
      ? `
          <button
            type="button"
            onclick="rerollSkillTarget('${target.toLowerCase()}')"
          >
            🔄 REROLL LV3 — 50 💰
          </button>
        `
      : level === 3
        ? `
            <button
              type="button"
              disabled
            >
              🔄 REROLL GIÀ USATO
            </button>
          `
      : nextSkill
        ? `
          <button
            type="button"
            onclick="upgradeSkillTarget('${target.toLowerCase()}'); next();"
          >
            ⭐ POTENZIA ${target}
          </button>
        `
        : `
          <button
            type="button"
            disabled
          >
            ⭐ MAX
          </button>
        `;

  return `
    <div class="skill-choice-card">

      <div class="skill-choice-head">

        <b>${target}</b>

        <span>
          ${pokemon.nome}
        </span>

        <em>
          SKILL LV ${level}
        </em>

      </div>

      <div class="skill-choice-body">

        <div class="skill-choice-sprite">

          <img
            src="${sprite(pokemon.immagine)}"
            alt="${pokemon.nome}"
          >

        </div>

        <div class="skill-choice-moves">

          <div class="skill-move-box">

            <small>
              ATTUALE
            </small>

            <strong>
              ${currentName}
            </strong>

            <span>
              PWR ${currentPower}
            </span>

          </div>

          <div class="skill-arrow">
            →
          </div>

          <div class="skill-move-box skill-move-next">

            <small>
              ${level < 3 ? "DIVENTA" : "REROLL"}
            </small>

            <strong>
              ${
                level < 3
                  ? nextName
                  : "SKILL LV3"
              }
            </strong>

            <span>
              ${
                level < 3
                  ? `PWR ${nextPower}`
                  : "50 💰"
              }
            </span>

          </div>

        </div>

      </div>

      ${action}

    </div>
  `;
};


const skill = () => {

    const s1 =
      PKM_RUN?.activePokemon || null;

    const s2 =
      PKM_RUN?.secondActive || null;

    if(!s1){
      return;
    }

    modal(`
      <div class="center skill-node">

        <h2>⚡ SKILL</h2>

        <p class="skill-node-subtitle">
          Scegli quale Pokémon potenziare.
        </p>

        <div class="skill-choice-list">

          ${buildSkillCard("S1", s1)}

          ${buildSkillCard("S2", s2)}

        </div>

        <button
          type="button"
          onclick="next()"
        >
          AVANTI
        </button>

      </div>
    `);
  };


  const rifugio = () => modal(`<div class="center"><h2>🏠 RIFUGIO</h2><button onclick="const p=getActivePokemon(); p.hp=clamp(p.hp+50,0,p.maxHp); addFel(15); refreshBottomPanel(); next('+50 HP +15 FEL');">RIPOSA</button><button onclick="next()">AVANTI</button></div>`);
  return { updateHPBar, addFel, consumeFel, upgradeSkill, upgradeSkillTarget, rerollSkillTarget, skill, rifugio };
})();
const { updateHPBar, addFel, consumeFel, upgradeSkill, upgradeSkillTarget, rerollSkillTarget, skill, rifugio } = PokeMisteryRL.Effects;
window.rerollSkillTarget = rerollSkillTarget;
window.upgradeSkillTarget = upgradeSkillTarget;
// #endregion
// #region 14 - BATTAGLIA | 15 - HUD | 16 - GAMEOVER

PokeMisteryRL.Battle = (() => {

  // POKEMON NEMICI

  const getPokemonByStage = (s) =>
    Object.values(PKM_DB).filter(
      p => Number(p.stage) === Number(s)
    );


  const getEnemyStage = (f, isBoss) =>
    isBoss
      ? (f < 3 ? 1 : f < 6 ? 2 : 3)
      : (f < 2 ? 1 : f < 5 ? 2 : 3);


  const getEnemyStats = (id) => {

    const p = PKM_DB[id];

    if (!p) {
      return {
        hp: 20,
        atk: 10,
        satk: 10,
        dif: 10,
        spd: 10
      };
    }

    const st =
      getStatsFromBST(
        p.bst,
        p.stage
      );

    if (PKM_RUN.floor >= 6) {

      const b =
        1 + (PKM_RUN.floor - 5) * 0.12;

      st.hp =
        Math.floor(st.hp * b);

      st.atk =
        Math.floor(st.atk * b);

      st.satk =
        Math.floor(st.satk * b);

      st.dif =
        Math.floor(st.dif * b);

      st.spd =
        Math.floor(st.spd * b);
    }

    return st;
  };


  const createEnemy = (isBoss) => {

    const currentNode =
      PKM_RUN?.map?.[PKM_RUN.row]?.[PKM_RUN.col] ||
      null;

    /*
     * IL NODO HA GIA' DECISO IL POKEMON DA MOSTRARE.
     * Il fight usa ESATTAMENTE quello sprite/quel Pokémon.
     */
    let base = null;

    if(
      currentNode?.enemyPreview?.id != null
    ){

      base =
        PKM_DB[currentNode.enemyPreview.id] ||
        Object.values(PKM_DB).find(
          p =>
            String(p.id) ===
            String(currentNode.enemyPreview.id)
        ) ||
        null;
    }

    /*
     * Fallback di sicurezza: se il nodo non ha preview,
     * manteniamo la vecchia selezione casuale.
     */
    if(!base){

      const stage =
        getEnemyStage(
          PKM_RUN.floor,
          isBoss
        );

      const pool =
        getPokemonByStage(stage);

      if(!pool.length){
        return null;
      }

      base =
        rand(pool);
    }

    const stats =
      getEnemyStats(base.id);

    /*
     * Questo è lo stesso livello mostrato nella card del fight:
     * enemyLevel = floor + 2.
     */
    const encounterLevel =
      Math.max(
        1,
        Number(PKM_RUN.floor) + 2
      );

    return {

      id: base.id,

      nome: base.nome,

      immagine: base.immagine,

      tipi: [...base.tipi],

      stage: base.stage,

      level: encounterLevel,

      hp: stats.hp,

      maxHp: stats.hp,

      stats
    };
  };


  // BATTAGLIA

  const fight = (isBoss = false) => {

    try {

      const starter1 =
        PKM_RUN?.activePokemon;

      const starter2 =
        PKM_RUN?.secondActive;


      // S1 È OBBLIGATORIO
      // S2 È FACOLTATIVO

      if (!starter1) {

        busy = 0;

        msg(
          "Serve S1 per combattere."
        );

        return;
      }


      const enemy =
        createEnemy(isBoss);


      if (!enemy) {

        busy = 0;

        next();

        return;
      }


      // STATO BATTAGLIA

      PKM_RUN.battle = {

        enemy,

        hp: enemy.hp,

        maxHp: enemy.maxHp,

        stats: enemy.stats,

        boss: !!isBoss,

        turn: 0,

        phase: 0

      };


      // COSTRUISCE LA SCHERMATA

      modal(
        PokeMisteryRL.UI.buildBattleTemplate(
          isBoss,
          PKM_RUN.floor
        )
      );


      PokeMisteryRL.UI.updateBattleHP();


      log(
        isBoss
          ? `⚠️ ${enemy.nome} BOSS!`
          : `⚔️ ${enemy.nome} selvatico!`,
        isBoss
          ? "boss"
          : ""
      );


      setTimeout(
        autoTurn,
        700
      );


    } catch (e) {

      console.error(e);

      busy = 0;

      closeModal();

      next();
    }
  };


  // UTILITY BATTAGLIA

  const getStarter1 = () =>
    PKM_RUN?.activePokemon || null;


  const getStarter2 = () =>
    PKM_RUN?.secondActive || null;


  const getAliveStarters = () => {

    return [

      getStarter1(),

      getStarter2()

    ].filter(
      p =>
        p &&
        Number(p.hp) > 0
    );
  };


  const isTeamDead = () =>
    getAliveStarters().length === 0;


  // ATTACCO

  const attack = (
    attacker,
    target,
    targetIsEnemy = false
    ) => {

    if (!attacker || !target) {
      return false;
    }


    if (Number(attacker.hp) <= 0) {
      return false;
    }


    if (
      !targetIsEnemy &&
      Number(target.hp) <= 0
    ) {
      return false;
    }


    const attackerStats =
      attacker.stats || {};


    const targetStats =
      targetIsEnemy
        ? PKM_RUN.battle.stats
        : target.stats || {};


    const mult =
      getTypeMultiplier(

        attacker.tipi?.[0] ||
          "normale",

        target.tipi || []
      );


    const base =
      Math.max(

        8,

        Math.floor(

          (Number(attackerStats.atk) * 50) /

          (Number(targetStats.dif) + 30)

        ) + 5

      );


    const crit =
      Math.random() < 0.15;


    const dmg =
      Math.max(

        1,

        Math.floor(

          base *
          mult *
          (crit ? 1.7 : 1)

        )

      );


    // DANNO

    if (targetIsEnemy) {

      const battle =
        PKM_RUN.battle;

      battle.hp =
        clamp(

          battle.hp - dmg,

          0,

          battle.maxHp

        );


      battle.enemy.hp =
        battle.hp;


    } else {

      target.hp =
        clamp(

          target.hp - dmg,

          0,

          target.maxHp

        );
    }


    // LOG

    log(

      `${attacker.nome} usa Attacco! -${dmg}` +

      `${crit ? " CRIT!" : ""} ` +

      `${getMultLabel(mult)}`
    );


    // ANIMAZIONE

    const targetName =
      targetIsEnemy
        ? "enemy"
        : target === getStarter2()
          ? "s2"
          : "s1";


    PokeMisteryRL.UI.spawnDamage(

      targetName,

      dmg,

      crit
        ? "crit"
        : "normal"
    );


    PokeMisteryRL.UI.hitShake(
      targetName
    );


    PokeMisteryRL.UI.updateBattleHP();


    return true;
  };


  // TURNO AUTOMATICO

  const autoTurn = () => {

    if (!PKM_RUN?.battle) {
      return;
    }


    const battle =
      PKM_RUN.battle;


    const s1 =
      getStarter1();

    const s2 =
      getStarter2();

    const enemy =
      battle.enemy;


    // CONTROLLO GAME OVER

    if (isTeamDead()) {

      gameover();

      return;
    }


    // CONTROLLO VITTORIA

    if (battle.hp <= 0) {

      win();

      return;
    }


    // CREA LISTA DEGLI ATTACCANTI VIVI

    const attackers = [

      s1,

      s2,

      enemy

    ].filter(
      p =>
        p &&
        Number(p.hp) > 0
    );


    // ORDINE PER SPD

    attackers.sort(
      (a, b) =>
        Number(b.stats?.spd ?? 0) -
        Number(a.stats?.spd ?? 0)
    );


    // ESEGUI UN ATTACCO ALLA VOLTA

    const attacker =
      attackers[battle.phase];


    if (!attacker) {

      battle.phase = 0;

      battle.turn++;


      setTimeout(
        autoTurn,
        900
      );

      return;
    }


    // IL NEMICO ATTACCA

    if (attacker === enemy) {

      const targets =
        getAliveStarters();


      if (!targets.length) {

        gameover();

        return;
      }


      // PRIORITÀ HP:
      // S2 PRIMA, POI S1

      let target = null;


      if (
        s2 &&
        Number(s2.hp) > 0
      ) {

        target = s2;

      } else if (
        s1 &&
        Number(s1.hp) > 0
      ) {

        target = s1;

      }


      if (!target) {

        gameover();

        return;
      }


      const enemyStats =
        battle.stats;


      const targetStats =
        target.stats || {};


      const eMult =
        getTypeMultiplier(

          enemy.tipi?.[0] ||
            "normale",

          target.tipi || []
        );


      const eBase =
        Math.max(

          5,

          Number(enemyStats.atk) -

          Math.floor(
            Number(targetStats.dif) * 0.35
          )

        );


      const eDmg =
        Math.max(

          1,

          Math.floor(
            eBase * eMult
          )

        );


      target.hp =
        clamp(

          target.hp - eDmg,

          0,

          target.maxHp

        );


      // Mantieni PKM_RUN.hp compatibile
      if (target === s1) {

        PKM_RUN.hp =
          target.hp;
      }


      log(

        `${enemy.nome} colpisce ${target.nome} -${eDmg}`

      );


      const targetName =
        target === s2
          ? "s2"
          : "s1";


      PokeMisteryRL.UI.spawnDamage(

        targetName,

        eDmg

      );


      PokeMisteryRL.UI.hitShake(
        targetName
      );


      PokeMisteryRL.UI.updateBattleHP();


      PokeMisteryRL.UI.refreshBottomPanel();


      // GAME OVER

      if (isTeamDead()) {

        setTimeout(
          gameover,
          500
        );

        return;
      }
    }


    // ATTACCO S1 / S2

    else {

      if (battle.hp <= 0) {

        win();

        return;
      }


      attack(

        attacker,

        enemy,

        true

      );


      if (battle.hp <= 0) {

        setTimeout(
          win,
          500
        );

        return;
      }
    }


    // PROSSIMO ATTACCANTE

    battle.phase++;


    setTimeout(
      autoTurn,
      650
    );
  };


  // FUGA

  const flee = () => {

    if (
      !PKM_RUN?.battle ||
      PKM_RUN.battle.boss
    ) {
      return;
    }


    addFel(-20);


    PKM_RUN.battle =
      null;


    busy = 0;


    next(
      "Fuga -20 FEL"
    );
  };


  // VITTORIA + RECLUTAMENTO
  const win = () => {
    if (!PKM_RUN?.battle) return;

    const battle = PKM_RUN.battle;
    const starter1 = PKM_RUN.activePokemon;
    const starter2 = PKM_RUN.secondActive;
    const reward = battle.boss ? 150 : 50;
    const levelReward = battle.boss ? 2 : 1;

    PKM_RUN.bits += reward;

    if (starter1) PokeMisteryRL_LevelSystem.levelUp(starter1, levelReward);
    if (starter2) PokeMisteryRL_LevelSystem.levelUp(starter2, levelReward);

    const defeated = battle.enemy;
    const recruited = PokeMisteryRL.TeamRoster.prepareRecruitment(defeated);

    // Chiudiamo lo stato di battaglia prima di mostrare la scelta.
    PKM_RUN.battle = null;
    busy = 0;
    PokeMisteryRL.UI.refreshBottomPanel();

    if (recruited) {
      window.showRecruitmentPrompt(recruited, reward, starter1, starter2);
      return;
    }

    modal(`
      <div class="center victory-box">
        <h2>VITTORIA!</h2>
        <p>+${reward}¥</p>
        <p style="opacity:.7">Impossibile preparare il reclutamento.</p>
        <button onclick="next('Vittoria!')">CONTINUA</button>
      </div>
    `);
  };

  // GAME OVER

  const gameover = () => {

    if (!PKM_RUN) {
      return;
    }


    PKM_RUN.battle =
      null;


    PKM_RUN.dead =
      true;


    busy = 0;


    const s1 =
      PKM_RUN.activePokemon;


    const s2 =
      PKM_RUN.secondActive;


    const s1Dead =
      !s1 ||
      Number(s1.hp) <= 0;


    const s2Dead =
      !s2 ||
      Number(s2.hp) <= 0;


    const deadNames = [

      s1Dead
        ? s1?.nome
        : null,

      s2Dead
        ? s2?.nome
        : null

    ].filter(Boolean);


    modal(`

      <div class="center">

        <h2 style="color:#ff4444">
          SEI MORTO
        </h2>

        <p>

          ${
            deadNames.length
              ? deadNames.join(" e ")
              : "I tuoi Pokémon"
          }

          sono esausti...

        </p>

        <button
          onclick="location.reload()"
        >
          RIPROVA
        </button>

      </div>

    `);
  };


  return {

    fight,

    autoTurn,

    flee,

    win,

    gameover

  };

})();


// UI

PokeMisteryRL.UI = (() => {


  // BOTTOM PANEL

  let teamPreviewIndex = 0;

  const getReserveTeam = () => {
    if(!PKM_RUN) return [];
    return (PKM_RUN.teamSlots || []).filter(Boolean);
  };

  const getRunInventory = () => {
    if(!PKM_RUN) return [];
    const raw = Array.isArray(PKM_RUN.inventory)
      ? PKM_RUN.inventory
      : (Array.isArray(PKM_RUN.items) ? PKM_RUN.items : []);
    return raw;
  };

  const getRunEggs = () => {
    if(!PKM_RUN) return [];
    const raw = Array.isArray(PKM_RUN.eggs)
      ? PKM_RUN.eggs
      : (Array.isArray(PKM_RUN.uova) ? PKM_RUN.uova : []);
    return raw;
  };

  const formatInventoryEntry = (item) => {
    if(item == null) return null;
    if(typeof item === "string") return { name:item, qty:1, icon:"📦" };
    if(typeof item === "number") return { name:"Oggetto", qty:item, icon:"📦" };
    return {
      name:item.nome || item.name || item.id || "Oggetto",
      qty:Number(item.qty ?? item.quantity ?? item.quantita ?? 1) || 1,
      icon:item.icon || item.emoji || "📦"
    };
  };

  const formatEggEntry = (egg) => {
    if(egg == null) return null;
    if(typeof egg === "string") return { name:egg, qty:1, icon:"🥚" };
    return {
      name:egg.nome || egg.name || egg.id || "Uovo",
      qty:Number(egg.qty ?? egg.quantity ?? egg.quantita ?? 1) || 1,
      icon:egg.icon || egg.emoji || "🥚"
    };
  };

  const refreshTeamViewer = () => {
    const box = $("teamViewer");
    const count = $("teamCount");
    const name = $("teamViewerName");
    const lv = $("teamViewerLevel");
    const img = $("teamViewerSprite");
    const prev = $("teamPrevBtn");
    const nextBtn = $("teamNextBtn");
    if(!box || !count || !name || !lv || !img) return;

    const team = getReserveTeam();
    if(!team.length){
      teamPreviewIndex = 0;
      count.textContent = "0/3";
      name.textContent = "Nessun Pokémon";
      lv.textContent = "";
      img.style.display = "none";
      if(prev) prev.disabled = true;
      if(nextBtn) nextBtn.disabled = true;
      return;
    }

    teamPreviewIndex = Math.max(0, Math.min(teamPreviewIndex, team.length - 1));
    const p = team[teamPreviewIndex];
    count.textContent = `${teamPreviewIndex + 1}/${team.length}`;
    name.textContent = p.nome || "Pokémon";
    lv.textContent = `LV ${PokeMisteryRL_LevelSystem.getLevel(p)}`;
    img.src = sprite(p.immagine);
    img.alt = p.nome || "Pokémon";
    img.style.display = "block";
    /*
     * I pulsanti devono essere gestiti direttamente qui, dopo ogni
     * refresh del Bottom. In questo modo un re-render non lascia
     * i vecchi handler o uno stato disabled errato.
     */
    const canRotate = team.length > 1;

    if(prev){
      prev.disabled = !canRotate;
      prev.style.pointerEvents = canRotate ? "auto" : "none";
      prev.onclick = canRotate
        ? function(e){
            e.preventDefault();
            e.stopPropagation();
            changeTeamPreview(-1);
          }
        : null;
    }

    if(nextBtn){
      nextBtn.disabled = !canRotate;
      nextBtn.style.pointerEvents = canRotate ? "auto" : "none";
      nextBtn.onclick = canRotate
        ? function(e){
            e.preventDefault();
            e.stopPropagation();
            changeTeamPreview(1);
          }
        : null;
    }
  };

  const changeTeamPreview = (delta) => {
    const team = getReserveTeam();

    if(!team.length){
      teamPreviewIndex = 0;
      refreshTeamViewer();
      return;
    }

    const step = Number(delta) || 0;

    teamPreviewIndex =
      (teamPreviewIndex + step + team.length) % team.length;

    refreshTeamViewer();
  };

  const showInventory = () => {
    const main = $("rightMainPanel");
    const inv = $("rightInventoryPanel");
    if(main) main.style.display = "none";
    if(inv) inv.style.display = "flex";
    refreshInventoryPanel();
  };

  const hideInventory = () => {
    const main = $("rightMainPanel");
    const inv = $("rightInventoryPanel");
    if(inv) inv.style.display = "none";
    if(main) main.style.display = "flex";
  };

  const refreshInventoryPanel = () => {
    const itemsEl = $("inventoryItems");
    const eggsEl = $("inventoryEggs");
    const incubatorSteps = $("incubatorStepsInv");
    if(!itemsEl || !eggsEl) return;

    const items = getRunInventory().map(formatInventoryEntry).filter(Boolean);
    const eggs = getRunEggs().map(formatEggEntry).filter(Boolean);

    itemsEl.innerHTML = items.length
      ? items.map(x => `<div class="inventory-entry"><span class="inventory-icon">${x.icon}</span><span class="inventory-name">${x.name}</span><b>x${x.qty}</b></div>`).join("")
      : `<div class="inventory-empty">Inventario vuoto</div>`;

    eggsEl.innerHTML = eggs.length
      ? eggs.map(x => `<div class="inventory-entry"><span class="inventory-icon">${x.icon}</span><span class="inventory-name">${x.name}</span><b>x${x.qty}</b></div>`).join("")
      : `<div class="inventory-empty">Nessun uovo</div>`;

    const inc = PKM_RUN?.incubator || PKM_RUN?.incubatore || {};
    if(incubatorSteps){
      const steps = Number(inc.steps ?? inc.passi ?? inc.remaining ?? inc.passirimanenti ?? 0) || 0;
      incubatorSteps.textContent = `Passi: ${steps}`;
    }
  };

  const buildBottomPanelTemplate = () => `

  <div id="bottomPanel" class="bottom-v8">

    <div class="b8-left">
      <div id="starter1Box" class="b8-pokemon-slot" onclick="openStarterPreview()">
        <img id="sideSprite" src="" alt="Starter 1">
      </div>

      <div id="starter2Slot" class="b8-pokemon-slot" onclick="openSecondPreview()">
        <span id="starter2Placeholder">+ S2</span>
        <img id="starter2Sprite" src="" alt="Starter 2" style="display:none">
      </div>
    </div>

    <div class="b8-center">
      <div class="b8-top">
        <span id="sideName" class="b8-name">-</span>
        <span class="b8-lv">LV <b id="levelVal">1</b></span>
        <div id="sideTyping" class="b8-typing"></div>
      </div>

      <div class="b8-bars">
        <div class="b8-bar-row">
          <span class="b8-icon">❤️</span>
          <div class="b8-bar-bg"><div id="hpFillSide" class="b8-fill hp" style="width:0%"></div></div>
          <span id="hpTextSide" class="b8-value">HP 0/0</span>
        </div>
      </div>

      <div class="b8-stats">
        <span>ATK <b id="atkVal">0</b></span>
        <span>DEF <b id="defVal">0</b></span>
        <span>SPD <b id="spdVal">0</b></span>
      </div>

      <div id="s2HudSection" class="b8-s2-section" style="display:none">
        <div class="b8-s2-header">
          <span id="s2Name" class="b8-s2-name">Partner</span>
          <span id="s2Level" class="b8-s2-level">LV 1</span>
          <div id="s2Typing" class="b8-typing b8-s2-typing"></div>
        </div>
        <div class="b8-bars">
          <div class="b8-bar-row">
            <span class="b8-icon">❤️</span>
            <div class="b8-bar-bg"><div id="s2HpBar" class="b8-fill hp" style="width:0%"></div></div>
            <span id="s2HpTxt" class="b8-value">HP</span>
          </div>
        </div>
        <div class="b8-stats">
          <span>ATK <b id="s2AtkVal">0</b></span>
          <span>DEF <b id="s2DefVal">0</b></span>
          <span>SPD <b id="s2SpdVal">0</b></span>
        </div>
      </div>

      <div
        id="quickItemSlots"
        class="b8-quick-items"
        aria-label="Oggetti rapidi"
      >
        ${Array.from({length:5},(_,i)=>`
          <div
            class="b8-quick-item empty"
            data-quick-item-slot="${i}"
          >
            <span class="quick-item-icon">+</span>
            <small></small>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="b8-right">

      <div id="rightMainPanel" class="b8-right-main">
        <div class="b8-money">
          <span class="b8-money-icon">💰</span>
          <b id="bits">0</b>
        </div>

        <div class="b8-incubator">
          <span>🥚</span>
          <div>
            <b>INCUBATORE</b>
            <small id="incubatorSteps">Passi: 0</small>
          </div>
        </div>

        <div id="teamViewer" class="b8-team-viewer">
          <div class="b8-team-header">
            <span>SQUADRA</span>
            <b id="teamCount">0/3</b>
          </div>
          <div class="b8-team-image-wrap">
            <button id="teamPrevBtn" class="team-nav" onclick="changeTeamPreview(-1)">◀</button>
            <img id="teamViewerSprite" src="" alt="Squadra" style="display:none">
            <button id="teamNextBtn" class="team-nav" onclick="changeTeamPreview(1)">▶</button>
          </div>
          <div id="teamViewerName" class="b8-team-viewer-name">Nessun Pokémon</div>
          <small id="teamViewerLevel" class="b8-team-viewer-level"></small>
        </div>

        <button class="b8-inventory-btn" onclick="showInventory()">🎒 INVENTARIO</button>
      </div>

      <div id="rightInventoryPanel" class="b8-inventory-panel" style="display:none">
        <div class="b8-inventory-title">🎒 INVENTARIO</div>

        <div class="b8-inventory-section">
          <b>OGGETTI</b>
          <div id="inventoryItems" class="inventory-list"></div>
        </div>

        <div class="b8-inventory-section">
          <b>UOVA</b>
          <div id="inventoryEggs" class="inventory-list"></div>
        </div>

        <div class="b8-inventory-incubator">
          🥚 <span id="incubatorStepsInv">Passi: 0</span>
        </div>

        <button class="b8-inventory-close" onclick="hideInventory()">◀ INDIETRO</button>
      </div>

    </div>
  </div>

  <section id="runLogPanel" class="run-log-panel">
    <button id="runLogToggle" class="run-log-toggle" onclick="toggleRunLog()">
      <span>📜 RUN LOG</span><span id="runLogArrow">▼</span>
    </button>
    <div id="runLogContent" class="run-log-content"></div>
  </section>

  `;

  const refreshBottomPanel = () => {

    if (!PKM_RUN) {
      return;
    }


    const p =
      getActivePokemon();


    if (!p) {
      return;
    }


    const sE =
      $("sideSprite");


    if (sE) {

      sE.src =
        sprite(
          p.immagine
        );
    }


    if ($("sideName")) {

      $("sideName").textContent =
        p.nome;
    }


    const level =
      PokeMisteryRL_LevelSystem.getLevel(
        p
      );


    if ($("levelVal")) {

      $("levelVal").textContent =
        level;
    }


    if ($("bits")) {

      $("bits").textContent =
        PKM_RUN.bits ?? 0;
    }


    if ($("atkVal")) {

      $("atkVal").textContent =
        p.stats?.atk ?? 0;
    }


    if ($("defVal")) {

      $("defVal").textContent =
        p.stats?.dif ?? 0;
    }


    if ($("spdVal")) {

      $("spdVal").textContent =
        p.stats?.spd ?? 0;
    }


    const s2 =
      PKM_RUN.secondActive;

    const s2Section =
      $("s2HudSection");

    if (s2Section) {

      if (s2) {

        s2Section.style.display =
          "block";

        if ($("s2Name")) {
          $("s2Name").textContent =
            s2.nome || "Partner";
        }

        if ($("s2Level")) {
          $("s2Level").textContent =
            `LV ${PokeMisteryRL_LevelSystem.getLevel(s2)}`;
        }

        if ($("s2Typing")) {
          $("s2Typing").innerHTML =
            (s2.tipi || [])
              .map(getTypingBadge)
              .join("");
        }

        const s2MaxHp =
          Math.max(
            1,
            Number(s2.maxHp) || 1
          );

        const s2Hp =
          clamp(
            Number(s2.hp) || 0,
            0,
            s2MaxHp
          );

        const s2Percent =
          clamp(
            s2Hp / s2MaxHp * 100,
            0,
            100
          );

        if ($("s2HpBar")) {
          $("s2HpBar").style.width =
            s2Percent + "%";
        }

        if ($("s2HpTxt")) {
          $("s2HpTxt").textContent =
            `${s2Hp}/${s2MaxHp}`;
        }

        if ($("s2AtkVal")) {
          $("s2AtkVal").textContent =
            s2.stats?.atk ?? 0;
        }

        if ($("s2DefVal")) {
          $("s2DefVal").textContent =
            s2.stats?.dif ?? 0;
        }

        if ($("s2SpdVal")) {
          $("s2SpdVal").textContent =
            s2.stats?.spd ?? 0;
        }

      } else {

        s2Section.style.display =
          "none";

      }
    }


    updateHPBar();


    if ($("sideTyping")) {

      $("sideTyping").innerHTML =

        (p.tipi || [])

          .map(
            getTypingBadge
          )

          .join("");
    }


    /*
     * OGGETTI RAPIDI — 5 slot del DB_ITEMS nel CENTER.
     * Mostriamo gli oggetti realmente presenti nella run.
     */

    /*
     * Dettaglio oggetto rapido.
     * Il click apre descrizione + pulsante EQUIPAGGIA.
     */
    if(!window.__quickItemDetailHandlers){

      window.__quickItemDetailHandlers = true;

      window.openQuickItemDetail = (
        itemId
      ) => {

        const db =
          window.PokeMisteryRL_Items?.DB_ITEMS ||
          window.DB_ITEMS ||
          null;

        const item =
          db && typeof db === "object"
            ? (
                db[itemId] ||
                Object.values(db).find(
                  x =>
                    x &&
                    String(x.id) ===
                    String(itemId)
                )
              )
            : null;

        if(!item){
          msg("Oggetto non disponibile.");
          return;
        }

        const name =
          item.nome ||
          item.name ||
          item.id ||
          "Oggetto";

        const description =
          item.descrizione ||
          item.description ||
          item.effetto ||
          item.effect ||
          "Nessuna descrizione disponibile.";

        const rarity =
          item.rarita ||
          item.rarity ||
          "comune";

        modal(`
          <div class="center quick-item-detail">

            <div class="quick-item-detail-icon">
              ${item.icon || "◈"}
            </div>

            <h2>
              ${name}
            </h2>

            <div class="quick-item-detail-rarity">
              ${rarity}
            </div>

            <p class="quick-item-detail-description">
              ${description}
            </p>

            <button
              type="button"
              onclick="equipQuickItem('${String(item.id).replace(/'/g,"\\'")}')"
            >
              ⭐ EQUIPAGGIA
            </button>

            <button
              type="button"
              onclick="closeModal()"
            >
              INDIETRO
            </button>

          </div>
        `);
      };

      window.equipQuickItem = (
        itemId
      ) => {

        if(!PKM_RUN){
          return false;
        }

        const db =
          window.PokeMisteryRL_Items?.DB_ITEMS ||
          window.DB_ITEMS ||
          null;

        const item =
          db && typeof db === "object"
            ? (
                db[itemId] ||
                Object.values(db).find(
                  x =>
                    x &&
                    String(x.id) ===
                    String(itemId)
                )
              )
            : null;

        if(!item){
          msg("Oggetto non disponibile.");
          return false;
        }

        /*
         * Se il sistema oggetti esterno espone un metodo di equipaggiamento,
         * usiamolo. In caso contrario salviamo comunque l'oggetto selezionato
         * nello stato run senza consumarlo.
         */
        const api =
          window.PokeMisteryRL_Items ||
          null;

        let equipped = false;

        const methods = [
          "equipItem",
          "equip",
          "setEquipped"
        ];

        for(const method of methods){

          if(
            api &&
            typeof api[method] === "function"
          ){

            try{

              const result =
                api[method](
                  item.id,
                  PKM_RUN.activePokemon
                );

              if(result !== false){
                equipped = true;
              }

            }catch(e){

              console.warn(
                "Equip item API error:",
                e
              );

            }

            break;
          }
        }

        if(!equipped){

          if(!Array.isArray(PKM_RUN.equippedItems)){
            PKM_RUN.equippedItems = [];
          }

          const oldIndex =
            PKM_RUN.equippedItems.findIndex(
              x =>
                x &&
                String(x.id) ===
                String(item.id)
            );

          const record = {
            id:item.id,
            nome:item.nome || item.name || item.id,
            icon:item.icon || item.emoji || "📦"
          };

          if(oldIndex >= 0){
            PKM_RUN.equippedItems[oldIndex] =
              record;
          }else{
            PKM_RUN.equippedItems.push(
              record
            );
          }
        }

        refreshBottomPanel();

        msg(
          `⭐ ${item.nome || item.name || item.id} equipaggiato!`
        );

        closeModal();

        return true;
      };

    }


    const quickItemSlots =
      $("quickItemSlots");

    if(quickItemSlots){

      const inventory =
        Array.isArray(PKM_RUN.items)
          ? PKM_RUN.items
          : Array.isArray(PKM_RUN.inventory)
            ? PKM_RUN.inventory
            : [];

      const db =
        window.PokeMisteryRL_Items?.DB_ITEMS ||
        window.DB_ITEMS ||
        null;

      const getDbItem = (entry) => {

        if(!entry){
          return null;
        }

        const id =
          typeof entry === "object"
            ? entry.id
            : entry;

        if(
          db &&
          typeof db === "object"
        ){

          return (
            db[id] ||
            Object.values(db).find(
              item =>
                item &&
                String(item.id) ===
                String(id)
            ) ||
            null
          );

        }

        return null;
      };

      const quickItems =
        inventory
          .map(entry => {

            const item =
              getDbItem(entry);

            const qty =
              typeof entry === "object"
                ? Number(
                    entry.qty ??
                    entry.quantity ??
                    entry.quantita ??
                    1
                  ) || 1
                : 1;

            return {
              item,
              qty
            };

          })
          .filter(
            x =>
              x.item &&
              x.qty > 0
          )
          .slice(0,5);

      const slots =
        quickItemSlots.querySelectorAll(
          "[data-quick-item-slot]"
        );

      slots.forEach(
        (slot,index) => {

          const data =
            quickItems[index];

          if(!data){

            slot.classList.add("empty");

            slot.innerHTML =
              `<span class="quick-item-icon">+</span><small></small>`;

            slot.title =
              "Slot oggetto vuoto";

            return;
          }

          const item =
            data.item;

          slot.classList.remove("empty");

          slot.innerHTML = `
            <span class="quick-item-icon">
              ${item.icon || "◈"}
            </span>

            <small>
              x${data.qty}
            </small>
          `;

          slot.title =
            `${item.nome || item.name || item.id} x${data.qty}`;

        }
      );

    }


    renderTeamSlots();
    refreshTeamViewer();

    const inc = PKM_RUN?.incubator || PKM_RUN?.incubatore || {};
    const steps = Number(inc.steps ?? inc.passi ?? inc.remaining ?? inc.passirimanenti ?? 0) || 0;
    if($("incubatorSteps")) $("incubatorSteps").textContent = `Passi: ${steps}`;
    refreshInventoryPanel();
  };


  // MAPPA

  const render = () => {

    if (!PKM_RUN) {
      return;
    }


    refreshBottomPanel();


    const map =
      $("map");


    if (!map) {
      return;
    }


    map.replaceChildren();


    const icons = {

      free: "⬇️",

      fight: "⚔️",

      boss: "👹",

      meat: "🍖",

      skill: "📈",

      shop: "🏪",

      event: "❓",

      rifugio: "🏠"

    };


    PKM_RUN.map.forEach(row => {

      const rowEl =
        document.createElement(
          "div"
        );


      rowEl.className =
        "map-row";


      row.forEach(node => {

        let cn =
          "node " +
          node.type;


        if (node.done) {

          cn += " done";

        } else if (

          node.row === PKM_RUN.row &&

          node.col === PKM_RUN.col

        ) {

          cn += " current";

        } else if (node.ok) {

          cn += " available";

        } else {

          cn += " locked";
        }


        const el =
          document.createElement(
            "div"
          );


        el.id =
          `n-${node.id}`;


        el.className =
          cn;


        /*
         * I nodi non attivi restano presenti come placeholder.
         * Soprattutto: NON ricevono pick(), così un click su un nodo
         * non raggiungibile non può bloccare la run.
         */
        const activeNode =
          node.ok === true ||
          (node.row === PKM_RUN.row && node.col === PKM_RUN.col);

        const isBattleNode =
          node.type === "fight" ||
          node.type === "boss";

        if(
          isBattleNode &&
          node.enemyPreview &&
          node.enemyPreview.immagine &&
          (node.ok || node.done || activeNode)
        ){

          el.innerHTML = `
            <span class="map-enemy-preview-crop" aria-hidden="true">
              <img
                class="map-enemy-preview-final"
                src="${sprite(node.enemyPreview.immagine)}"
                alt="${node.enemyPreview.nome || "Nemico"}"
              >
            </span>
            <span class="map-sword-final" aria-hidden="true">⚔️</span>
          `;

          el.onclick =
            () => pick(node);

        }else if (activeNode || node.done) {

          el.textContent =
            icons[node.type] ||
            "❓";

          el.onclick =
            () => pick(node);

        } else {

          el.classList.add("map-placeholder");
          el.textContent = "•";
          el.onclick = null;
          el.removeAttribute("onclick");
          el.setAttribute("aria-hidden", "true");
          el.title = "Nodo non disponibile";

        }


        rowEl.appendChild(el);

      });


      map.appendChild(rowEl);

    });


    if (!mapResizeObserver) {

      mapResizeObserver =
        new ResizeObserver(

          () =>
            PokeMisteryRL.Map
              .drawMapLines()

        );

      mapResizeObserver.observe(
        map
      );
    }


    setTimeout(

      PokeMisteryRL.Map
        .drawMapLines,

      50

    );
  };


  // BATTLE HP

  const updateBattleHP = () => {

    if(!PKM_RUN?.battle){
      return;
    }

    const s1 =
      PKM_RUN.activePokemon;

    const s2 =
      PKM_RUN.secondActive;

    const battle =
      PKM_RUN.battle;

    const enemy =
      battle.enemy;


    const updateOne = (
      pokemon,
      hp,
      maxHp,
      barId,
      textId
    ) => {

      if(!pokemon){
        return;
      }

      const safeMax =
        Math.max(
          1,
          Number(maxHp) || 1
        );

      const safeHp =
        clamp(
          Number(hp) || 0,
          0,
          safeMax
        );

      const percent =
        safeHp / safeMax * 100;


      const bar =
        $(barId);

      if(bar){
        bar.style.width =
          `${percent}%`;
      }


      const text =
        $(textId);

      if(text){
        text.textContent =
          `HP ${safeHp}/${safeMax}`;
      }

    };


    updateOne(
      s1,
      s1?.hp,
      s1?.maxHp,
      "battleS1HpBar",
      "battleS1HpTxt"
    );


    /*
     * S2: aggiorna direttamente il pannello del fight.
     * Non dipende dal pannello Bottom e non usa ID duplicati.
     */
    if(s2){

      const s2Max =
        Math.max(
          1,
          Number(s2.maxHp) || 1
        );

      const s2Current =
        clamp(
          Number(s2.hp) || 0,
          0,
          s2Max
        );

      const s2Percent =
        s2Current / s2Max * 100;

      const s2Bar =
        document.querySelector(
          "#battleFinal #battleS2HpBar"
        );

      if(s2Bar){
        s2Bar.style.width =
          `${s2Percent}%`;
      }

      const s2Text =
        document.querySelector(
          "#battleFinal #battleS2HpTxt"
        );

      if(s2Text){
        s2Text.textContent =
          `HP ${s2Current}/${s2Max}`;
      }

    }


    updateOne(
      enemy,
      battle.hp,
      battle.maxHp,
      "battleEnemyHpBar",
      "battleEnemyHpTxt"
    );


    const s2Sprite =
      document.querySelector(
        "#battleFinal .bf-sprite.s2"
      );


    if(
      s2Sprite &&
      s2 &&
      Number(s2.hp) <= 0
    ){
      s2Sprite.classList.add(
        "dead"
      );
    }

  };


  // BATTLE TEMPLATE

  const buildBattleTemplate =
    (isBoss, floor) => {

      const s1 = PKM_RUN?.activePokemon;
      const s2 = PKM_RUN?.secondActive;
      const battle = PKM_RUN?.battle;
      const enemy = battle?.enemy;

      if(!s1 || !enemy){
        return `
          <div id="battleFinal">
            <div class="center">
              <h2>BATTAGLIA NON DISPONIBILE</h2>
              <p>S1 o il nemico non sono disponibili.</p>
            </div>
          </div>
        `;
      }

      const buildCard = (
        pokemon,
        cls,
        hpBarId,
        hpTextId,
        enemyCard = false
      ) => {

        if(!pokemon){
          return `
            <div class="bf-hp ${cls} empty">
              <div class="bf-name-row">
                <b>S2</b>
              </div>
              <div class="bar">
                <div id="${hpBarId}" style="width:0%"></div>
              </div>
              <span id="${hpTextId}">HP 0/0</span>
            </div>
          `;
        }

        const hpValue = enemyCard
          ? Number(battle?.hp) || 0
          : Number(pokemon.hp) || 0;

        const maxHpValue = Math.max(
          1,
          Number(
            enemyCard
              ? battle?.maxHp
              : pokemon.maxHp
          ) || 1
        );

        const hpPercent = clamp(
          hpValue / maxHpValue * 100,
          0,
          100
        );

        return `
          <div class="bf-hp ${cls}">

            <div class="bf-name-row">
              <b>${pokemon.nome}</b>
            </div>

            <div class="bar">
              <div
                id="${hpBarId}"
                style="width:${hpPercent}%"
              ></div>
            </div>

            <span
              id="${hpTextId}"
              class="bf-hp-text"
            >
              HP ${hpValue}/${maxHpValue}
            </span>

          </div>
        `;
      };

      const enemyCard = {
        ...enemy,
        hp:battle.hp,
        maxHp:battle.maxHp
      };

      return `
        <div id="battleFinal">

          <div class="bf-top">

            ${buildCard(
              s1,
              "blue",
              "battleS1HpBar",
              "battleS1HpTxt"
            )}

            ${buildCard(
              s2,
              "green",
              "battleS2HpBar",
              "battleS2HpTxt"
            )}

            ${buildCard(
              enemyCard,
              "red",
              "battleEnemyHpBar",
              "battleEnemyHpTxt",
              true
            )}

          </div>

          <div class="bf-field">

            <div class="bf-sprite s1">
              <img
                src="${sprite(s1.immagine)}"
                alt="${s1.nome}"
              >
            </div>

            ${
              s2
                ? `
                  <div class="bf-sprite s2">
                    <img
                      src="${sprite(s2.immagine)}"
                      alt="${s2.nome}"
                    >
                  </div>
                `
                : `
                  <div class="bf-sprite s2 empty">
                    <div class="bf-empty-slot">S2</div>
                  </div>
                `
            }

            <div class="bf-sprite enemy">
              <img
                src="${sprite(enemy.immagine)}"
                alt="${enemy.nome}"
              >
            </div>

          </div>

          <div class="bf-logRow">

            <div
              class="bf-log"
              id="blog"
            ></div>

            <div class="bf-fleeBox">

              ${
                !isBoss
                  ? `
                    <button
                      class="btn-flee"
                      onclick="flee()"
                    >
                      🏃 FUGGI
                    </button>
                  `
                  : ""
              }

            </div>

          </div>

        </div>
      `;
    };


  const hitShake = (target) => {

    let selector;


    if (target === "enemy") {

      selector =
        ".bf-sprite.enemy";

    } else if (target === "s2") {

      selector =
        ".bf-sprite.s2";

    } else {

      selector =
        ".bf-sprite.s1";
    }


    const w =
      document.querySelector(
        selector
      );


    if (!w) {
      return;
    }


    w.classList.remove(
      "hit"
    );


    void w.offsetWidth;


    w.classList.add(
      "hit"
    );
  };


  // DAMAGE NUMBERS

  const spawnDamage =
    (
      target,
      value,
      type = "normal"
    ) => {

      let selector;


      if (target === "enemy") {

        selector =
          ".bf-sprite.enemy";

      } else if (target === "s2") {

        selector =
          ".bf-sprite.s2";

      } else {

        selector =
          ".bf-sprite.s1";
      }


      const w =
        document.querySelector(
          selector
        );


      if (!w) {
        return;
      }


      const el =
        document.createElement(
          "div"
        );


      el.className =
        `dmg-num ${target} ${type}`;


      el.textContent =

        type === "heal"

          ? `+${fmt(value)}`

          : type === "crit"

            ? `${fmt(value)}!`

            : `-${fmt(value)}`;


      w.appendChild(el);


      setTimeout(

        () => el.remove(),

        900

      );
    };


  // INFO POKEMON

  const openPokeInfo = (index) => {

    const pokemon =

      index === -1

        ? getActivePokemon()

        : PKM_RUN?.teamSlots?.[index];


    if (!pokemon) {
      return;
    }


    if ($("pokeInfoSprite"))

      $("pokeInfoSprite").src =
        sprite(
          pokemon.immagine
        );


    if ($("pokeInfoName"))

      $("pokeInfoName").textContent =

        pokemon.nome +

        (
          index === -1
            ? " [STARTER]"
            : ""
        );


    if ($("pokeInfoTypes"))

      $("pokeInfoTypes").innerHTML =

        pokemon.tipi

          .map(
            getTypingBadge
          )

          .join("");


    if ($("piHp"))

      $("piHp").textContent =
        `${pokemon.hp}/${pokemon.maxHp}`;


    if ($("piAtk"))

      $("piAtk").textContent =
        pokemon.stats.atk;


    if ($("piAtkR"))

      $("piAtkR").textContent =

        pokemon.rolls?.atk

          ? `(${fmtIV(
              pokemon.rolls.atk
            )})`

          : "";


    if ($("piDef"))

      $("piDef").textContent =
        pokemon.stats.dif;


    if ($("piDefR"))

      $("piDefR").textContent =

        pokemon.rolls?.dif

          ? `(${fmtIV(
              pokemon.rolls.dif
            )})`

          : "";


    if ($("piSpd"))

      $("piSpd").textContent =
        pokemon.stats.spd;


    if ($("piSpdR"))

      $("piSpdR").textContent =

        pokemon.rolls?.spd

          ? `(${fmtIV(
              pokemon.rolls.spd
            )})`

          : "";


    if ($("piCrit"))

      $("piCrit").textContent =
        pokemon.crit ?? 0;


    if ($("piEva"))

      $("piEva").textContent =
        pokemon.eva ?? 0;


    if ($("piStun"))

      $("piStun").textContent =
        pokemon.stun ?? 0;


    if ($("piFel"))

      $("piFel").textContent =
        pokemon.fel ?? 0;


    const actions =
      $("pokeInfoActions");


    if (actions) {

      actions.innerHTML =

        index >= 0

          ? `

            <button
              class="danger"
              onclick="releasePoke(${index})"
            >
              Abbandona
            </button>

          `

          : `

            <small class="small">

              Starter attuale -

              LV ${
                PokeMisteryRL_LevelSystem
                  .getLevel(pokemon)
              }

            </small>

          `;
    }


    $("pokeInfo")
      ?.classList.remove(
        "hidden"
      );
  };


  const closePokeInfo = () =>
    $("pokeInfo")
      ?.classList.add(
        "hidden"
      );


  return {

    buildBottomPanelTemplate,

    refreshBottomPanel,

    render,

    updateBattleHP,

    buildBattleTemplate,

    hitShake,

    spawnDamage,

    openPokeInfo,

    closePokeInfo

  };

})();


  
const recruitLevel = (p) =>
  Math.max(1, Number(p?.level) || 1);

const recruitSkill = (p) => {

  if(!p) return null;

  if(
    Array.isArray(p.skills) &&
    p.skills.length
  ){
    return p.skills[p.skills.length - 1];
  }

  return null;
};

const recruitCard = (
  pokemon,
  title
) => {

  if(!pokemon){
    return `
      <div class="recruit-empty">
        Nessun Pokémon
      </div>
    `;
  }

  const sk =
    recruitSkill(pokemon);

  return `
    <div class="recruit-card">

      <div class="recruit-card-title">
        ${title}
      </div>

      <div class="recruit-card-main">

        <div class="recruit-card-sprite">
          <img
            src="${sprite(pokemon.immagine)}"
            alt="${pokemon.nome || "Pokémon"}"
          >
        </div>

        <div class="recruit-card-info">

          <b class="recruit-name">
            ${pokemon.nome || "Pokémon"}
          </b>

          <span>
            LV ${recruitLevel(pokemon)}
          </span>

          <span>
            HP ${pokemon.hp ?? 0}/${pokemon.maxHp ?? 0}
          </span>

          <div class="recruit-skill">
            <small>SKILL</small>
            <b>
              ${
                sk?.name ||
                sk?.nome ||
                "--"
              }
            </b>
            <span>
              PWR ${
                sk?.pwr ??
                sk?.power ??
                "--"
              }
            </span>
          </div>

        </div>

      </div>

      <div class="recruit-stats">

        <div>
          <small>ATK</small>
          <b>${pokemon.stats?.atk ?? 0}</b>
        </div>

        <div>
          <small>DEF</small>
          <b>${pokemon.stats?.dif ?? 0}</b>
        </div>

        <div>
          <small>SPD</small>
          <b>${pokemon.stats?.spd ?? 0}</b>
        </div>

      </div>

    </div>
  `;
};

const getFullTeamSwitchOptions = () => {

  const options = [];

  if(PKM_RUN?.secondActive){

    options.push({
      key:"s2",
      label:"S2",
      pokemon:PKM_RUN.secondActive
    });
  }

  (PKM_RUN?.teamSlots || [])
    .forEach(
      (pokemon,index) => {

        if(!pokemon) return;

        options.push({
          key:String(index),
          label:`RISERVA ${index + 1}`,
          pokemon
        });
      }
    );

  return options;
};

const showFullTeamSwitch = () => {

  const pending =
    window._pendingRecruitment;

  if(!pending){
    return;
  }

  const options =
    getFullTeamSwitchOptions();

  modal(`
    <div class="recruitment-box recruit-full-team">

      <button
        type="button"
        class="recruit-close-x"
        onclick="closeModal(); busy=0; PokeMisteryRL.UI.render();"
      >
        ✕
      </button>

      <h2>
        ⭐ NUOVO POKÉMON
      </h2>

      ${recruitCard(
        pending.pokemon,
        "POKÉMON DA RECLUTARE"
      )}

      <div class="recruit-divider">
        SQUADRA PIENA — SCEGLI CHI SOSTITUIRE
      </div>

      <div class="recruit-options">

        ${
          options.length
            ? options.map(option => `
                <button
                  type="button"
                  class="recruit-option" data-recruit-key="${option.key}"
                  onclick="event.preventDefault(); event.stopPropagation(); window.compareRecruitment('${option.key}');"
                >

                  <img
                    src="${sprite(option.pokemon.immagine)}"
                    alt="${option.pokemon.nome || "Pokémon"}"
                  >

                  <span>
                    <b>
                      ${option.pokemon.nome || "Pokémon"}
                    </b>
                    <small>
                      ${option.label} · LV ${recruitLevel(option.pokemon)}
                    </small>
                  </span>

                  <strong>
                    SOSTITUISCI
                  </strong>

                </button>
              `).join("")
            : `
                <div class="recruit-empty">
                  Nessun Pokémon sostituibile.
                </div>
              `
        }

      </div>

    </div>
  `);
};


</script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/RECRUIT_SYSTEM_REGION.js"></script>
<script>
// EXPORT

const {
  render,
  refreshBottomPanel,
  buildBottomPanelTemplate
} =
  PokeMisteryRL.UI;


const {
  fight,
  flee,
  gameover
} =
  PokeMisteryRL.Battle;


const openPokeInfo =
  PokeMisteryRL.UI.openPokeInfo;


const closePokeInfo =
  PokeMisteryRL.UI.closePokeInfo;


// #endregion
// #region 17 - EXPORT + 18 - AVVIO
window.openStarterPreview = () => {

  const p = PKM_RUN?.activePokemon;

  if(!p){
    msg("Nessuno Starter1 disponibile");
    return;
  }

  fillPreview(p, `
    <p style="opacity:.5;font-size:11px">
      Starter principale
    </p>
  `);
};

window.openSecondPreview = () => {

  if(!PKM_RUN) return;

  const s1 =
    PKM_RUN.activePokemon;

  const current =
    PKM_RUN.secondActive;

  if(!s1){
    msg("Nessuno Starter1 disponibile");
    return;
  }

  const team =
    (PKM_RUN.teamSlots || [])
      .map((p,i) => ({p,i}))
      .filter(
        x =>
          x.p &&
          x.p !== s1
      );

  let choices = `
    <div style="
      margin-top:10px;
      padding-top:8px;
      border-top:1px solid rgba(49,85,121,.45);
    ">
      <div style="
        font-size:11px;
        font-weight:bold;
        margin-bottom:7px;
        color:#55d9ff;
      ">
        ⭐ SCEGLI COMPAGNO S2
      </div>

      <div style="
        font-size:9px;
        opacity:.65;
        margin-bottom:7px;
      ">
        Seleziona un Pokémon della squadra.
      </div>
  `;

  if(!team.length){

    choices += `
      <div style="
        padding:10px;
        text-align:center;
        opacity:.6;
        font-size:9px;
      ">
        Nessun altro Pokémon nella squadra.
      </div>
    `;

  }else{

    choices += `
      <div class="s2-choice-list">

        ${team.map(({p,i}) => {

          const isCurrent =
            current === p;

          const types =
            (p.tipi || [])
              .slice(0,2)
              .map(
                t =>
                  `<span class="type-badge type-${t}">${t}</span>`
              )
              .join("");

          return `
            <button
              type="button"
              class="s2-choice-card ${isCurrent ? "selected" : ""}"
              data-s2-index="${i}"
            >

              <img
                src="${sprite(p.immagine)}"
                alt="${p.nome || "Pokémon"}"
              >

              <div class="s2-choice-info">

                <b>
                  ${p.nome || "Pokémon"}
                </b>

                <span>
                  LV ${p.level || 1}
                </span>

                <span>
                  HP ${p.hp ?? 0}/${p.maxHp ?? 0}
                </span>

                <span class="s2-choice-types">
                  ${types}
                </span>

              </div>

              ${
                isCurrent
                  ? `<strong class="s2-current">S2</strong>`
                  : ""
              }

            </button>
          `;

        }).join("")}

      </div>
    `;
  }

  choices += `</div>`;

  if(current){

    choices += `
      <div style="margin-top:8px">

        <button
          type="button"
          onclick="unequipSecond()"
        >
          ⬇️ Togli compagno
        </button>

        <button
          type="button"
          onclick="releaseSecond()"
          class="danger"
        >
          🗑️ Rilascia S2
        </button>

      </div>
    `;
  }

  /*
   * La tab S2 mostra S2 sopra, non S1.
   * Se S2 non è ancora equipaggiato, mostriamo un placeholder
   * mantenendo la stessa struttura della tab S1.
   */
  if(current){

    fillPreview(
      current,
      choices
    );

  }else{

    /*
     * Nessun S2 equipaggiato:
     * niente anteprima vuota e niente S1 al posto di S2.
     * Mostriamo solo il box informativo + la lista dei Pokémon
     * disponibili come compagno.
     */
    modal(`
      <div class="center">

        <div style="
          padding:10px;
          border:1px solid rgba(49,85,121,.55);
          border-radius:10px;
          background:rgba(7,19,33,.75);
          margin-bottom:8px;
        ">

          <div style="
            font-size:12px;
            font-weight:bold;
            color:#55d9ff;
            margin-bottom:5px;
          ">
            S2 NON EQUIPAGGIATO
          </div>

          <div style="
            font-size:9px;
            opacity:.7;
          ">
            Scegli un Pokémon della squadra da usare come compagno S2.
          </div>

        </div>

        ${choices}

        <button
          type="button"
          class="s2-tab-close"
          onclick="closeModal(); busy=0; PokeMisteryRL.UI.render();"
          aria-label="Chiudi"
          title="Chiudi"
        >
          ✕
        </button>

      </div>
    `);

  }
};

window.openTeamPreview = (i) => {
  const p = PKM_RUN?.teamSlots?.[i];
  if (!p) return;

  // usa fillPreview se esiste, altrimenti fallback manuale
  if (typeof fillPreview === 'function') {
    fillPreview(p, `
      <p style="font-size:11px;opacity:.6;margin:0 0 8px">ID ${p.id} | ${(p.tipi||[]).join('/')} | LV ${p.level||1} | HP ${p.hp}/${p.maxHp}</p>
      <div class="pp-actions" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button onclick="equipAsSecond(${i})">⭐ Imposta compagno</button>
        ${typeof equipToStarter === 'function'? `<button onclick="equipToStarter(0,${i})">➡️ S1</button><button onclick="equipToStarter(1,${i})">➡️ S2</button>` : ``}
        <button onclick="releasePoke(${i})">🗑️ Rilascia</button>
      </div>
    `);
  } else {
    // fallback vecchio se fillPreview non c'è
    document.getElementById('ppSprite').src = sprite(p.immagine);
    document.getElementById('ppName').textContent = p.nome;
    document.getElementById('ppLevel').textContent = `LV ${p.level||1}`;
    document.getElementById('ppHpText').textContent = `${p.hp}/${p.maxHp}`;
    document.getElementById('ppTypes').innerHTML = (p.tipi||[]).map(t=>`<span class="type-badge type-${t}">${t}</span>`).join('');
    document.getElementById('ppCustomContent').innerHTML = `
      <p style="font-size:11px;opacity:.6">ID ${p.id} | ${(p.tipi||[]).join('/')}</p>
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        <button onclick="equipAsSecond(${i})">⭐ Equipaggia come Starter2</button>
        <button onclick="releasePoke(${i})">🗑️ Rilascia</button>
      </div>`;
    document.getElementById('pokePreview').classList.remove('hidden');
  }
};
window.PKM_RUN = PKM_RUN;
window.start = window.startPokemon = PokeMisteryRL.Run.startPokemon;
window.pick = pick; window.next = next; window.flee = flee;
window.quickReset = PokeMisteryRL.Run.quickReset;
window.goMenu = PokeMisteryRL.Run.goMenu;
window.skill = skill; window.rifugio = rifugio; window.upgradeSkill = upgradeSkill;
window.addFel = addFel; window.consumeFel = consumeFel;
window.toggleRunLog = toggleRunLog;
window.showInventory = () => PokeMisteryRL.UI.showInventory();
window.hideInventory = () => PokeMisteryRL.UI.hideInventory();
window.changeTeamPreview = (d) => PokeMisteryRL.UI.changeTeamPreview(d);
const shop = () => {

  if(!PKM_RUN){
    return;
  }

  const db =
    window.PokeMisteryRL_Items?.DB_ITEMS ||
    window.DB_ITEMS ||
    null;

  const items =
    db && typeof db === "object"
      ? Object.values(db).filter(item => item && item.id)
      : [];

  if(!items.length){
    modal(`
      <div class="center">
        <h2>🛒 NEGOZIO</h2>
        <p>Il database oggetti non è ancora disponibile.</p>
        <button onclick="next('Negozio non disponibile')">
          CONTINUA
        </button>
      </div>
    `);
    return;
  }

  const rarityPrice = {
    comune: 50,
    non_comune: 100,
    rara: 175,
    epica: 300,
    leggendaria: 500
  };

  const pool = [...items];
  const offers = [];

  while(pool.length && offers.length < 3){
    const index =
      Math.floor(Math.random() * pool.length);

    const item =
      pool.splice(index,1)[0];

    offers.push({
      item,
      price:
        rarityPrice[item.rarita] ??
        rarityPrice.comune
    });
  }

  modal(`
    <div class="center shop-box">

      <h2>🛒 NEGOZIO</h2>

      <p>
        💰 <b>${Number(PKM_RUN.bits) || 0}</b>
      </p>

      <div class="shop-list">
        ${
          offers.map(({item,price}) => `
            <div class="shop-card">

              <div class="shop-icon">
                ${item.icon || "◈"}
              </div>

              <div class="shop-name">
                ${item.nome || item.id}
              </div>

              <div class="shop-rarity">
                ${item.rarita || "comune"}
              </div>

              <div class="shop-effect">
                ${item.effetto || "—"}
              </div>

              <div class="shop-price">
                💰 ${price}
              </div>

              <button
                type="button"
                onclick="buyShopItem('${String(item.id).replace(/'/g,"\\'")}',${price})"
              >
                ACQUISTA
              </button>

            </div>
          `).join("")
        }
      </div>

      <button type="button" onclick="next('Negozio visitato')">
        ESCI
      </button>

    </div>
  `);
};

const buyShopItem = (itemId, price) => {

  if(!PKM_RUN){
    return false;
  }

  const db =
    window.PokeMisteryRL_Items ||
    null;

  const item =
    db?.get?.(itemId) ||
    window.DB_ITEMS?.[itemId] ||
    null;

  if(!item){
    msg("Oggetto non disponibile.");
    return false;
  }

  const cost =
    Math.max(0, Math.floor(Number(price) || 0));

  const money =
    Math.max(0, Math.floor(Number(PKM_RUN.bits) || 0));

  if(money < cost){
    msg(`Servono ${cost} 💰.`);
    return false;
  }

  if(!Array.isArray(PKM_RUN.items)){
    PKM_RUN.items = [];
  }

  const existing =
    PKM_RUN.items.find(
      entry =>
        entry &&
        String(entry.id) === String(item.id)
    );

  if(existing){
    existing.qty =
      Math.max(0, Number(existing.qty) || 0) + 1;
  }else{
    PKM_RUN.items.push({
      id: item.id,
      qty: 1
    });
  }

  PKM_RUN.bits =
    money - cost;

  refreshBottomPanel();

  msg(`🛒 ${item.nome} acquistato!`);

  shop();

  return true;
};

window.shop = shop;
window.buyShopItem = buyShopItem;

const eggEvent = () => {

  if(!PKM_RUN){
    return;
  }

  if(!Array.isArray(PKM_RUN.eggs)){
    PKM_RUN.eggs = [];
  }

  PKM_RUN.eggs.push({
    id:`egg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
    nome:"Uovo Pokémon",
    name:"Uovo Pokémon",
    icon:"🥚",
    qty:1,
    passi:1,
    steps:1
  });

  PokeMisteryRL.UI.refreshBottomPanel();

  msg("🥚 Hai trovato un Uovo Pokémon!");

  modal(`
    <div class="center">
      <h2>🥚 UOVO POKÉMON!</h2>

      <div style="font-size:58px;line-height:1;margin:12px 0">🥚</div>

      <p>
        Hai ottenuto un <b>Uovo Pokémon</b>!
      </p>

      <p style="opacity:.65;font-size:10px">
        L'uovo è stato aggiunto al tuo inventario.
      </p>

      <button onclick="next('Hai trovato un Uovo Pokémon!')">
        CONTINUA
      </button>
    </div>
  `);
};
window.eggEvent = eggEvent;
window.getPokemon = getPokemon; window.getActivePokemon = getActivePokemon;
window.getTeamStats = getTeamStats; window.PKM_DB = PKM_DB;
window.renderMap = render; window.refreshBottomPanel = refreshBottomPanel;
window.evolvePokemon = evolvePokemon; window.checkEvolve = checkEvolve;
window.openPokeInfo = openPokeInfo; window.closePokeInfo = closePokeInfo;
window.closeEvolutionPrompt = closeEvolutionPrompt;
window.releasePoke = releasePoke; window.swapToActive = swapToActive;
window.equipAsSecond = equipAsSecond;
window.unequipSecond = unequipSecond;
window.releaseSecond = releaseSecond;
window.openSecondPreview = openSecondPreview;
document.addEventListener("DOMContentLoaded", () => {
  buildPokemonDB();
  $("menu")?.classList.remove("hidden");
  console.log(`PokeMisteryRL Core v8.1 - ${Object.keys(PKM_DB).length} Pokémon - MODULAR`);
});
// #endregion




</script>
<script src="https://cdn.jsdelivr.net/gh/ilGuru96/PMLTest@main/SKILL_SYSTEM_REGION.js"></script>
<script>
;

  
</script>

<script id="bottomTeamInteractionFix">
(function(){
  if(window.__bottomTeamInteractionFix) return;
  window.__bottomTeamInteractionFix=true;

  document.addEventListener("click",function(e){
    const el=e.target.closest("#bottomContainer [data-team-index],#bottomContainer .team-slot");
    if(!el) return;

    const i=Number(el.dataset.teamIndex ?? el.dataset.index);
    if(!Number.isInteger(i) || !window.PKM_RUN) return;

    const p=PKM_RUN.teamSlots?.[i];
    if(!p) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof PokeMisteryRL?.TeamRoster?.openTeamPreview==="function"){
      PokeMisteryRL.TeamRoster.openTeamPreview(i);
    }else if(typeof PokeMisteryRL?.UI?.openPokeInfo==="function"){
      PokeMisteryRL.UI.openPokeInfo(p,i);
    }
  },true);
})();
</script>

<script id="bottomInventoryInteractionFix">
(function(){
  function getInventory(){
    const r=window.PKM_RUN||{};
    return r.inventory ?? r.items ?? {};
  }

  window.openBottomInventory=function(){
    const right=document.querySelector("#bottomContainer .b8-right") ||
                document.getElementById("bottomRightPanel");
    if(!right) return;

    let panel=document.getElementById("bottomInventoryPanel");
    if(!panel){
      panel=document.createElement("div");
      panel.id="bottomInventoryPanel";
      panel.className="bottom-inventory-panel";
      right.dataset.originalHtml=right.innerHTML;
      right.innerHTML="";
      right.appendChild(panel);
    }

    const items=getInventory();
    const entries=Array.isArray(items)
      ? items.map((x,i)=>({
          name:x?.nome||x?.name||`Oggetto ${i+1}`,
          qty:x?.quantita??x?.qty??1
        }))
      : Object.entries(items).map(([name,qty])=>({name,qty}));

    panel.innerHTML=`
      <div class="bip-head">
        <b>🎒 INVENTARIO</b>
        <button type="button" onclick="closeBottomInventory()">✕</button>
      </div>
      <div class="bip-title">OGGETTI</div>
      <div class="bip-list">
        ${entries.length
          ? entries.map(x=>`<div class="bip-row"><span>${x.name}</span><b>x${x.qty}</b></div>`).join("")
          : `<div class="bip-empty">Inventario vuoto</div>`}
      </div>
    `;
  }

  window.closeBottomInventory=function(){
    const right=document.querySelector("#bottomContainer .b8-right") ||
                document.getElementById("bottomRightPanel");
    if(!right || right.dataset.originalHtml===undefined) return;

    right.innerHTML=right.dataset.originalHtml;
    delete right.dataset.originalHtml;
  }

  document.addEventListener("click",function(e){
    const b=e.target.closest("#bottomContainer button");
    if(!b) return;
    const t=(b.textContent||"").toLowerCase();
    if(t.includes("inventario") || t.includes("🎒")){
      e.preventDefault();
      e.stopImmediatePropagation();
      openBottomInventory();
    }
  },true);
})();
</script>

<script id="s2CompanionSlotFix">
(function(){
  if(window.__s2CompanionSlotFix) return;
  window.__s2CompanionSlotFix = true;

  document.addEventListener("click", function(e){
    var slot = e.target.closest ? e.target.closest("#starter2Slot") : null;
    if(!slot) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.openSecondPreview === "function"){
      window.openSecondPreview();
    }
  }, true);
})();
</script>


<script id="modalOrderFix">
(function(){
  if(window.__modalOrderFix) return;
  window.__modalOrderFix=true;

  var stack=[];

  function isVisible(el){
    return el && !el.classList.contains("hidden") &&
      getComputedStyle(el).display !== "none";
  }

  function sync(){
    stack=stack.filter(isVisible);
    document.body.classList.toggle("modal-child-open", stack.length>1);
  }

  document.addEventListener("click",function(e){
    var modal=e.target.closest(".modal,.modal-box,#pokePreview,[role='dialog']");
    if(!modal || !isVisible(modal)) return;

    var close=e.target.closest(
      ".modal-close,[data-close],.close-btn,.close,.pp-close"
    );

    if(close && stack.length){
      var top=stack[stack.length-1];
      if(top!==modal){
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }
  },true);

  var observer=new MutationObserver(function(){
    var visible=[].slice.call(document.querySelectorAll(
      ".modal,.modal-box,#pokePreview,[role='dialog']"
    )).filter(isVisible);

    visible.forEach(function(el){
      if(stack.indexOf(el)<0) stack.push(el);
    });

    stack=stack.filter(isVisible);
    sync();
  });

  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","style","hidden"]});
})();
</script>

<script id="strictModalLockFix">
(function(){
  if(window.__strictModalLockFix) return;
  window.__strictModalLockFix=true;

  function visible(el){
    if(!el) return false;
    var cs=getComputedStyle(el);
    return !el.classList.contains("hidden") &&
           cs.display!=="none" &&
           cs.visibility!=="hidden";
  }

  function topModal(){
    var all=[].slice.call(document.querySelectorAll(
      "#modal,#pokePreview,.modal,[role='dialog']"
    ));
    var visibleOnes=all.filter(visible);
    return visibleOnes.length ? visibleOnes[visibleOnes.length-1] : null;
  }

  /*
   * BLOCCA COMPLETAMENTE il click sullo sfondo.
   * Prima il click poteva arrivare alla mappa e farla tornare visibile.
   */
  document.addEventListener("pointerdown",function(e){
    var top=topModal();
    if(!top) return;

    if(!top.contains(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  document.addEventListener("click",function(e){
    var top=topModal();
    if(!top) return;

    /*
     * Qualsiasi click fuori dalla finestra più recente viene ignorato.
     * Non chiude la finestra e soprattutto non raggiunge la mappa.
     */
    if(!top.contains(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
  },true);

  /*
   * Escape non deve chiudere una finestra sottostante.
   * Se esiste una finestra aperta, agisce solo sulla più recente
   * attraverso il suo eventuale pulsante di chiusura.
   */
  document.addEventListener("keydown",function(e){
    if(e.key!=="Escape") return;

    var top=topModal();
    if(!top) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    var close=top.querySelector(
      ".modal-close,[data-close],.close-btn,.close,.pp-close"
    );

    if(close) close.click();
  },true);
})();
</script>

<script id="absoluteModalBackdropBlock">
(function(){
  if(window.__absoluteModalBackdropBlock) return;
  window.__absoluteModalBackdropBlock=true;

  function blockBackdrop(e){
    var preview=document.getElementById("pokePreview");
    var modal=document.getElementById("modal");

    /*
     * #pokePreview è il backdrop fixed.
     * Un click sul backdrop NON deve mai chiudere la tab
     * e NON deve mai arrivare alla mappa.
     */
    if(preview && !preview.classList.contains("hidden") && e.target===preview){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }

    /*
     * Stessa protezione per il modal principale.
     */
    if(modal && !modal.classList.contains("hidden") && e.target===modal){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }

  document.addEventListener("pointerdown",blockBackdrop,true);
  document.addEventListener("mousedown",blockBackdrop,true);
  document.addEventListener("mouseup",blockBackdrop,true);
  document.addEventListener("click",blockBackdrop,true);
  document.addEventListener("touchstart",blockBackdrop,true);
  document.addEventListener("touchend",blockBackdrop,true);

  /*
   * Se il gioco ha handler globali che reagiscono a pointer events,
   * il backdrop li intercetta direttamente.
   */
  function install(){
    var preview=document.getElementById("pokePreview");
    var modal=document.getElementById("modal");

    if(preview && !preview.__backdropLock){
      preview.__backdropLock=true;
      ["pointerdown","mousedown","mouseup","click","touchstart","touchend"]
        .forEach(function(type){
          preview.addEventListener(type,function(e){
            if(e.target===preview){
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          },true);
        });
    }

    if(modal && !modal.__backdropLock){
      modal.__backdropLock=true;
      ["pointerdown","mousedown","mouseup","click","touchstart","touchend"]
        .forEach(function(type){
          modal.addEventListener(type,function(e){
            if(e.target===modal){
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          },true);
        });
    }
  }

  install();

  new MutationObserver(install).observe(document.body,{
    childList:true,
    subtree:true
  });
})();
</script>


<script id="s2DirectSwapCapture">
(function(){
  if(window.__s2DirectSwapCapture) return;
  window.__s2DirectSwapCapture = true;

  document.addEventListener("click", function(e){

    var card =
      e.target && e.target.closest
        ? e.target.closest(".s2-choice-card")
        : null;

    if(!card){
      return;
    }

    var index =
      card.getAttribute("data-s2-index");

    if(index === null){
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.equipAsSecond === "function"){
      window.equipAsSecond(Number(index));
    }

  }, true);
})();
</script>

<script id="quickItemClickHandler">
(function(){
  if(window.__quickItemClickHandler) return;
  window.__quickItemClickHandler = true;

  document.addEventListener("click",function(e){

    const slot =
      e.target.closest
        ? e.target.closest(
            "#quickItemSlots [data-quick-item-slot]"
          )
        : null;

    if(!slot){
      return;
    }

    const index =
      Number(
        slot.getAttribute(
          "data-quick-item-slot"
        )
      );

    const inventory =
      Array.isArray(window.PKM_RUN?.items)
        ? window.PKM_RUN.items
        : Array.isArray(window.PKM_RUN?.inventory)
          ? window.PKM_RUN.inventory
          : [];

    const entries =
      inventory
        .filter(Boolean)
        .slice(0,5);

    const entry =
      entries[index];

    if(!entry){
      return;
    }

    const itemId =
      typeof entry === "object"
        ? entry.id
        : entry;

    if(itemId == null){
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.openQuickItemDetail === "function"){
      window.openQuickItemDetail(itemId);
    }

  },true);
})();
</script>
</body>
</html>
