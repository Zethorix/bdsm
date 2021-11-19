(this["webpackJsonpboxbox-dungeon-simulator"]=this["webpackJsonpboxbox-dungeon-simulator"]||[]).push([[0],[function(module,__webpack_exports__,__webpack_require__){"use strict";function logIf(e,a){e&&console.log(a)}function formatDescriptionWithTier(description,tier){for(var re=/\{([\dt+\-*]+)\}/,current=description,m=current.match(re);null!=m;)current=current.replace(m[0],eval(m[1].replace("t",tier))),m=current.match(re);return current}function extend(e,a){for(var t in a)e.push(a[t])}function all(e,a){return e.reduce((function(e,t){return e&&a(t)}),!0)}function sum(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=0;for(var r in e){var n=e[r];if("function"!==typeof a)if(null!=a)a in n?t+=n[a]:t++;else{if("number"===typeof n){t+=n;continue}t++}else t+=a(n)}return t}function withProbability(e){return Math.random()<e}function pickRandom(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=sum(e,a),r=Math.floor(Math.random()*t);for(var n in e){var o=1;if("function"===typeof a?o=a(e[n]):null!=a&&(o=e[n][a]),r<o)return n;r-=o}throw Error("Internal Error: Something went wrong while selecting random element from "+e+" with weightKey "+a)}function pickRandomWithinRange(e,a){return e+Math.floor(Math.random()*(a-e+1))}function deepCopyJson(e){return JSON.parse(JSON.stringify(e))}function _mutateTemplate(e,a){if("object"!=typeof e)return e;if("Base"in e&&"Scaling"in e)return e.Base+e.Scaling*a;for(var t in e)e[t]=_mutateTemplate(e[t],a);return e}function getScaledTemplate(e,a){return _mutateTemplate(deepCopyJson(e),a)}__webpack_require__.d(__webpack_exports__,"d",(function(){return logIf})),__webpack_require__.d(__webpack_exports__,"a",(function(){return all})),__webpack_require__.d(__webpack_exports__,"g",(function(){return withProbability})),__webpack_require__.d(__webpack_exports__,"e",(function(){return pickRandom})),__webpack_require__.d(__webpack_exports__,"f",(function(){return pickRandomWithinRange})),__webpack_require__.d(__webpack_exports__,"b",(function(){return deepCopyJson})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getScaledTemplate}))},,,,,,,function(e){e.exports=JSON.parse('{"Avalanche":{"Description":"Spend 40 energy. Deal {3*t}-{5*t} damage to a random enemy twice. They lose 0-{t} speed.","Cost":40},"Boosting Bugle":{"Description":"Spend 55 energy: heal an ally for {2*t}HP. They gain {t} attack. Repeat this once. This cannot target yourself or summons.","Cost":55},"Challenger Arrow":{"Description":"Spend 55 energy: Deal {10*t} damage to a random enemy. Gain +{t} attack.","Cost":55},"Energetic Ally":{"Description":"Spend 50 energy: The lowest non-summoned ally heals for {5*t}HP and gains 20 energy.","Cost":50},"Explosion Powder":{"Description":"Spend 60 energy: Deal {5*t}-{10*t} damage to all enemies. If there is only one enemy, this deals double damage.","Cost":60},"Imp Whistle":{"Description":"Spend 45 energy: summon a small imp companion. {t}hp {3*t}-{4*t}atk {11+t} spd","Cost":45},"Knight\'s Lance":{"Description":"Spend 40 energy. Deal {5*t}-{7*t} damage to a random enemy and heal the same amount. If you are at full health, this deals double damage.","Cost":40}}')},function(e){e.exports=JSON.parse('{"Big Club":{"Obtainable":true,"Description":"Your attacks have a {11*t}% chance to deal 150% bonus damage.","Triggers":["PreDamage"]},"Celine\'s Chumby Chicken":{"Obtainable":true,"Description":"The first time you attack each wave, summon a chumby chicken. {t}HP, Heals all allies for {2*t}HP when it dies.","Triggers":["TurnStart"]},"Chicken Dinner":{"Obtainable":false,"Description":"When you die on an opponent\'s turn, your allies all eat you (FLUSH). They heal for {2*t} HP. This item cannot be obtained, so its exact description is unknown.","Triggers":["Death"]},"Cleansing Flames":{"Obtainable":true,"Description":"After you attack, you have a 50% chance to heal all allies for {t} HP.","Triggers":["PostDamage"]},"Draining Dagger":{"Obtainable":true,"Description":"Your attacks decrease the target\'s attack by {t}. {5*t}% chance to drain 1 energy from the target.","Triggers":["Target"]},"Fire Sword":{"Obtainable":true,"Description":"When you attack, you have a 30% chance to increase your attack by 1. Repeat this {t-1} additional times.","Triggers":["PostDamage"]},"Freezeman":{"Obtainable":true,"Description":"Gain {t} speed.","Triggers":[]},"Halberd":{"Obtainable":true,"Description":"You have +{2*t} attack.","Triggers":[]},"Healing Pendant":{"Obtainable":true,"Description":"Your attacks have a 50% chance to heal yourself for {5*t} HP. {7+3*t}% Chance to take the hit when your teammate is attacked, if you\'re feeling brave.","Triggers":["Block","TurnStart"]},"Love Letter":{"Obtainable":true,"Description":"After you attack, you heal an ally for {2*t} and they gain {t} energy. This cannot target yourself or summons.","Triggers":["PostDamage"]},"Machete":{"Obtainable":true,"Description":"Your attacks deal {3*t}-{4*t} damage to an additional enemy.","Triggers":["Target"]},"Magic Parasol":{"Obtainable":true,"Description":"When you are attacked, you have a {5+5*t}% chance to fully block the attack. {7+3*t}% Chance to take the hit when your teammate is attacked, if you\'re feeling brave.","Triggers":["Block","EnemyDamage"]},"Martyr Armor":{"Obtainable":true,"Description":"When you take damage on an opponent\u2019s turn, you have a 66% chance to heal a random ally {2*t}HP and give them {t} Energy. This cannot target yourself or summons.","Triggers":["EnemyDamage"]},"Pet Imp":{"Obtainable":true,"Description":"At the start of the dungeon, summon a big imp companion. {10*t}hp {3*t}-{4*t}atk. Spd: {11+t}","Triggers":["BattleStart"]},"Poison Dagger":{"Obtainable":true,"Description":"Your attacks add {t} poison stack to the target. A poisoned enemy takes 1 damage after they attack for each poison stack they have.","Triggers":["Target"]},"Rock Companion":{"Obtainable":true,"Description":"At the start of the dungeon, summon a brave Rock Companion. {15*t}hp {5*t}atk 2spd","Triggers":["BattleStart"]},"Rough Skin":{"Obtainable":false,"Description":"50% chance to reduce an attack by {2*t} and deal {2*t} damage to the attacker.","Triggers":["EnemyDamage"]},"Seeking Missiles":{"Obtainable":true,"Description":"Your attacks always target the lowest HP enemy. Deal {t} bonus damage per 20% HP they are missing","Triggers":["Target","PreDamage"]},"Survival Kit":{"Obtainable":true,"Description":"Increase Max HP by {20*t}. {7+3*t}% Chance to take a hit when your teammate is attacked if you\'re feeling brave.","Triggers":["Block"]},"Thorns":{"Obtainable":true,"Description":"When you attack, unleash a thorn at each enemy. Each thorn deals {t} damage and gives you a 25% chance to gain {t} energy. You can only gain energy from this effect once per turn.","Triggers":["TurnStart"]},"Whirlwind Axe":{"Obtainable":true,"Description":"When you attack, you have a {11*t}% chance of making your attack deal splash damage to all other enemies.","Triggers":["PreDamage"]}}')},function(e){e.exports=JSON.parse('{"Celine\'s Chumby Chicken":{"Character":"Celine\'s Chumby Chicken","HP":{"Base":0,"Scaling":1},"HP Max":{"Base":0,"Scaling":1},"Speed":1,"Attack Low":0,"Attack High":1,"Energy":0,"Summoned":true,"Items":[{"Name":"Chicken Dinner","Tier":{"Base":0,"Scaling":1}}]},"Imp Whistle":{"Character":"Small Imp Companion","HP":{"Base":0,"Scaling":1},"HP Max":{"Base":0,"Scaling":1},"Speed":{"Base":11,"Scaling":1},"Attack Low":{"Base":0,"Scaling":3},"Attack High":{"Base":0,"Scaling":4},"Energy":0,"Summoned":true,"Items":[]},"Pet Imp":{"Character":"Big Imp Companion","HP":{"Base":0,"Scaling":10},"HP Max":{"Base":0,"Scaling":10},"Speed":{"Base":11,"Scaling":1},"Attack Low":{"Base":0,"Scaling":3},"Attack High":{"Base":0,"Scaling":4},"Energy":0,"Summoned":true,"Items":[]},"Rock Companion":{"Character":"Rock Companion","HP":{"Base":0,"Scaling":15},"HP Max":{"Base":0,"Scaling":15},"Speed":2,"Attack Low":{"Base":0,"Scaling":5},"Attack High":{"Base":0,"Scaling":5},"Energy":0,"Summoned":true,"Items":[{"Name":"Healing Pendant","Tier":{"Base":0,"Scaling":1}}]}}')},,,,,,,,function(e,a,t){var r={"./season_2/items/energy_items.json":7,"./season_2/items/passive_items.json":8,"./season_2/mobs/dungeon_0.json":18,"./season_2/mobs/dungeon_1.json":19,"./season_2/mobs/dungeon_10.json":20,"./season_2/mobs/dungeon_2.json":21,"./season_2/mobs/dungeon_3.json":22,"./season_2/mobs/dungeon_4.json":23,"./season_2/mobs/dungeon_5.json":24,"./season_2/mobs/dungeon_6.json":25,"./season_2/mobs/dungeon_7.json":26,"./season_2/mobs/dungeon_8.json":27,"./season_2/mobs/dungeon_9.json":28,"./season_2/mobs/summon_templates.json":9};function n(e){var a=o(e);return t(a)}function o(e){if(!t.o(r,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return r[e]}n.keys=function(){return Object.keys(r)},n.resolve=o,e.exports=n,n.id=17},function(e){e.exports=JSON.parse('[[{"Character":"Stickbaby 1","HP":10,"HP Max":10,"Speed":6,"Attack Low":5,"Attack High":5,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Stickbaby 2","HP":10,"HP Max":10,"Speed":6,"Attack Low":5,"Attack High":5,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Stickbaby 3","HP":10,"HP Max":10,"Speed":6,"Attack Low":5,"Attack High":5,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Stickbaby 4","HP":10,"HP Max":10,"Speed":6,"Attack Low":5,"Attack High":5,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Stickman","HP":25,"HP Max":25,"Speed":8,"Attack Low":6,"Attack High":10,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Stickwoman","HP":20,"HP Max":20,"Speed":10,"Attack Low":10,"Attack High":12,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Big Stick","HP":50,"HP Max":50,"Speed":10,"Attack Low":12,"Attack High":12,"Energy":0,"Summoned":false,"Items":[]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Blob","HP":10,"HP Max":10,"Speed":10,"Attack Low":2,"Attack High":2,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Blobther","HP":15,"HP Max":15,"Speed":10,"Attack Low":2,"Attack High":4,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Blob\'s Mom","HP":20,"HP Max":20,"Speed":10,"Attack Low":3,"Attack High":3,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Blob\'s Dad","HP":20,"HP Max":20,"Speed":10,"Attack Low":3,"Attack High":4,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Blob\'s Grandpa","HP":30,"HP Max":30,"Speed":10,"Attack Low":8,"Attack High":16,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Bandit","HP":15,"HP Max":15,"Speed":12,"Attack Low":6,"Attack High":10,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Bandit\'s Hot GF","HP":20,"HP Max":20,"Speed":12,"Attack Low":8,"Attack High":10,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Bandad","HP":25,"HP Max":25,"Speed":12,"Attack Low":8,"Attack High":12,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Bandit\'s Twin","HP":15,"HP Max":15,"Speed":12,"Attack Low":6,"Attack High":10,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Albert","HP":53,"HP Max":100,"Speed":10,"Attack Low":6,"Attack High":15,"Energy":0,"Summoned":false,"Items":[{"Name":"Fire Sword","Tier":1}],"_stats":{"_triggeredFireSword":8,"_attacks":30}},{"Character":"Annie","HP":47,"HP Max":100,"Speed":10,"Attack Low":3,"Attack High":12,"Energy":56,"Summoned":false,"Items":[{"Name":"Love Letter","Tier":1}]},{"Character":"Kelvinzorz","HP":43,"HP Max":100,"Speed":10,"Attack Low":3,"Attack High":12,"Energy":0,"Summoned":false,"Items":[{"Name":"Poison Dagger","Tier":1}]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Sonic The Hedgehog","HP":750,"HP Max":750,"Speed":150,"Attack Low":0,"Attack High":0,"Energy":0,"Summoned":false,"Items":[{"Name":"Fire Sword","Tier":7}],"_stats":{"_maxFireSwordTriggers":5,"_triggeredFireSword":65,"_attacks":29}}],[{"Character":"Amy Rose","HP":250,"HP Max":250,"Speed":22,"Attack Low":20,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Whirlwind Axe","Tier":9}],"_stats":{"_triggeredWhirlwindAxe":16,"_attacks":16}},{"Character":"Big The Cat","HP":300,"HP Max":300,"Speed":12,"Attack Low":40,"Attack High":80,"Energy":0,"Summoned":false,"Items":[{"Name":"Healing Pendant","Tier":3},{"Name":"Magic Parasol","Tier":9}],"_stats":{"_triggeredBlock":11,"_availableBlocks":27,"_triggeredMagicParasol":12,"_defended":23}},{"Character":"Knuckles The Echidna","HP":200,"HP Max":200,"Speed":25,"Attack Low":10,"Attack High":60,"Energy":0,"Summoned":false,"Items":[{"Name":"Seeking Missiles","Tier":5},{"Name":"Big Club","Tier":6}],"_stats":{"_triggeredBigClub":15,"_attacks":21}},{"Character":"Miles Tails Prowler","HP":250,"HP Max":250,"Speed":30,"Attack Low":10,"Attack High":30,"Energy":90,"Summoned":false,"Items":[{"Name":"Boosting Bugle","Tier":5},{"Name":"Thorns","Tier":5},{"Name":"Cleansing Flames","Tier":7}]}],[{"Character":"Shadow The Hedgehog","HP":600,"HP Max":600,"Speed":80,"Attack Low":5,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Thorns","Tier":9},{"Name":"Explosion Powder","Tier":9},{"Name":"Healing Pendant","Tier":9}]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Pig","HP":35,"HP Max":35,"Speed":12,"Attack Low":6,"Attack High":8,"Energy":0,"Items":[]},{"Character":"Ribbon Pig","HP":35,"HP Max":35,"Speed":12,"Attack Low":6,"Attack High":8,"Energy":0,"Items":[]},{"Character":"Boar","HP":35,"HP Max":35,"Speed":12,"Attack Low":6,"Attack High":8,"Energy":0,"Items":[]},{"Character":"Fire Boar","HP":50,"HP Max":50,"Speed":15,"Attack Low":8,"Attack High":12,"Energy":0,"Items":[]}],[{"Character":"Horny Mushroom","HP":60,"HP Max":60,"Speed":10,"Attack Low":15,"Attack High":15,"Energy":0,"Items":[]},{"Character":"Orange Mushroom","HP":45,"HP Max":45,"Speed":12,"Attack Low":8,"Attack High":16,"Energy":0,"Items":[]},{"Character":"Green Mushroom","HP":45,"HP Max":45,"Speed":10,"Attack Low":10,"Attack High":15,"Energy":0,"Items":[{"Name":"Poison Dagger","Tier":1}]}],[{"Character":"Red Snail","HP":20,"HP Max":20,"Speed":3,"Attack Low":1,"Attack High":2,"Energy":0,"Items":[{"Name":"Rough Skin","Tier":1}]},{"Character":"A Very Large Snail","HP":150,"HP Max":150,"Speed":7,"Attack Low":20,"Attack High":40,"Energy":0,"Items":[{"Name":"Rough Skin","Tier":3}]},{"Character":"Blue Snail","HP":20,"HP Max":20,"Speed":3,"Attack Low":1,"Attack High":2,"Energy":0,"Items":[{"Name":"Rough Skin","Tier":1}]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Kappa","HP":100,"HP Max":100,"Speed":16,"Attack Low":10,"Attack High":20,"Energy":20,"Summoned":false,"Items":[{"Name":"Knight\'s Lance","Tier":2},{"Name":"Love Letter","Tier":2}]},{"Character":"KappaPride","HP":80,"HP Max":80,"Speed":16,"Attack Low":8,"Attack High":14,"Energy":10,"Summoned":false,"Items":[{"Name":"Knight\'s Lance","Tier":2},{"Name":"Love Letter","Tier":2}]}],[{"Character":"PepeHands","HP":50,"HP Max":50,"Speed":12,"Attack Low":8,"Attack High":12,"Energy":0,"Summoned":false,"Items":[{"Name":"Cleansing Flames","Tier":1}]},{"Character":"Pepega","HP":75,"HP Max":75,"Speed":10,"Attack Low":5,"Attack High":10,"Energy":0,"Summoned":false,"Items":[{"Name":"Poison Dagger","Tier":2}]},{"Character":"MonkaS","HP":75,"HP Max":75,"Speed":11,"Attack Low":1,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Big Club","Tier":5}],"_stats":{"_triggeredBigClub":"10","_attacks":"16"}},{"Character":"Rock Companion","HP":30,"HP Max":30,"Speed":2,"Attack Low":10,"Attack High":10,"Energy":0,"Summoned":true,"Items":[{"Name":"Healing Pendant","Tier":2}]}],[{"Character":"PogChamp","HP":150,"HP Max":150,"Speed":15,"Attack Low":10,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Whirlwind Axe","Tier":3}],"_stats":{"_triggeredWhirlwindAxe":7,"_attacks":21}},{"Character":"Pog","HP":125,"HP Max":125,"Speed":15,"Attack Low":10,"Attack High":15,"Energy":0,"Summoned":false,"Items":[]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"G Fuel","HP":80,"HP Max":80,"Speed":20,"Attack Low":0,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Imp Whistle","Tier":2}]},{"Character":"Boba","HP":125,"HP Max":125,"Speed":14,"Attack Low":15,"Attack High":25,"Energy":0,"Summoned":false,"Items":[{"Name":"Avalanche","Tier":1}]},{"Character":"A Hearty Glass of Water","HP":100,"HP Max":100,"Speed":12,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Love Letter","Tier":4}]}],[{"Character":"Mozzarella Sticks","HP":100,"HP Max":100,"Speed":14,"Attack Low":6,"Attack High":12,"Energy":0,"Summoned":false,"Items":[{"Name":"Poison Dagger","Tier":3}]},{"Character":"Miso Soup","HP":50,"HP Max":50,"Speed":13,"Attack Low":5,"Attack High":15,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Salad","HP":125,"HP Max":125,"Speed":12,"Attack Low":5,"Attack High":14,"Energy":0,"Summoned":false,"Items":[{"Name":"Healing Pendant","Tier":3}],"_stats":{"_triggeredBlock":9,"_availableBlocks":46}},{"Character":"Takoyaki","HP":75,"HP Max":75,"Speed":12,"Attack Low":5,"Attack High":10,"Energy":0,"Summoned":false,"Items":[{"Name":"Poison Dagger","Tier":3}]}],[{"Character":"Sushi Boat","HP":350,"HP Max":350,"Speed":30,"Attack Low":10,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Machete","Tier":2}]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Cidd The Helpful","HP":2,"HP Max":2,"Speed":100,"Attack Low":4,"Attack High":4,"Energy":0,"Summoned":false,"Items":[{"Name":"Seeking Missiles","Tier":1},{"Name":"Fire Sword","Tier":3}],"_stats":{"_maxFireSwordTriggers":3,"_triggeredFireSword":52,"_attacks":54}},{"Character":"Treebeast","HP":120,"HP Max":120,"Speed":15,"Attack Low":10,"Attack High":15,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Ivan, The Drunken Brawler","HP":140,"HP Max":140,"Speed":16,"Attack Low":15,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Whirlwind Axe","Tier":3}],"_stats":{"_triggeredWhirlwindAxe":7,"_attacks":19}},{"Character":"Brittney, Beach Princess","HP":160,"HP Max":160,"Speed":17,"Attack Low":20,"Attack High":25,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"The Wandering Fisherman","HP":125,"HP Max":125,"Speed":8,"Attack Low":25,"Attack High":25,"Energy":0,"Summoned":false,"Items":[]},{"Character":"The Great Forest Seer","HP":150,"HP Max":150,"Speed":17,"Attack Low":12,"Attack High":22,"Energy":0,"Summoned":false,"Items":[{"Name":"Avalanche","Tier":3}]},{"Character":"The Masked Samurai","HP":175,"HP Max":175,"Speed":21,"Attack Low":12,"Attack High":16,"Energy":0,"Summoned":false,"Items":[{"Name":"Machete","Tier":4}]}],[{"Character":"Dread Knight","HP":175,"HP Max":175,"Speed":9,"Attack Low":30,"Attack High":50,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Betty Clicker","HP":75,"HP Max":75,"Speed":15,"Attack Low":5,"Attack High":5,"Energy":200,"Summoned":false,"Items":[{"Name":"Boosting Bugle","Tier":3}]},{"Character":"King Midas","HP":150,"HP Max":150,"Speed":11,"Attack Low":10,"Attack High":15,"Energy":0,"Summoned":false,"Items":[{"Name":"Healing Pendant","Tier":1},{"Name":"Magic Parasol","Tier":1}],"_stats":{"_triggeredBlock":2,"_availableBlocks":10,"_triggeredMagicParasol":1,"_defended":9}},{"Character":"Leon","HP":100,"HP Max":100,"Speed":25,"Attack Low":5,"Attack High":15,"Energy":0,"Summoned":false,"Items":[{"Name":"Seeking Missiles","Tier":3}]},{"Character":"Amenhotep","HP":40,"HP Max":40,"Speed":13,"Attack Low":0,"Attack High":10,"Energy":0,"Summoned":false,"Items":[]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Tenya Iida","HP":175,"HP Max":175,"Speed":25,"Attack Low":5,"Attack High":15,"Energy":999,"Summoned":false,"Items":[{"Name":"Boosting Bugle","Tier":1}]},{"Character":"Shoto Todoroki","HP":200,"HP Max":200,"Speed":12,"Attack Low":0,"Attack High":40,"Energy":0,"Summoned":false,"Items":[{"Name":"Avalanche","Tier":3},{"Name":"Fire Sword","Tier":5}],"_stats":{"_maxFireSwordTriggers":4,"_triggeredFireSword":30,"_attacks":20}},{"Character":"Tsuyu Asui","HP":150,"HP Max":150,"Speed":18,"Attack Low":5,"Attack High":25,"Energy":0,"Summoned":false,"Items":[{"Name":"Draining Dagger","Tier":1},{"Name":"Rough Skin","Tier":2}]}],[{"Character":"Fat Gum","HP":300,"HP Max":300,"Speed":6,"Attack Low":50,"Attack High":100,"Energy":0,"Summoned":false,"Items":[{"Name":"Martyr Armor","Tier":3}]},{"Character":"Hawks","HP":200,"HP Max":200,"Speed":35,"Attack Low":1,"Attack High":10,"Energy":0,"Summoned":false,"Items":[{"Name":"Challenger Arrow","Tier":2},{"Name":"Thorns","Tier":3}]}],[{"Character":"All-Might","HP":200,"HP Max":200,"Speed":15,"Attack Low":35,"Attack High":55,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Izuku Midoriya","HP":200,"HP Max":200,"Speed":25,"Attack Low":20,"Attack High":35,"Energy":0,"Summoned":false,"Items":[]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Boosette","HP":200,"HP Max":200,"Speed":15,"Attack Low":33,"Attack High":66,"Energy":0,"Summoned":false,"Items":[{"Name":"Seeking Missiles","Tier":1}]},{"Character":"Bowsette","HP":140,"HP Max":140,"Speed":15,"Attack Low":33,"Attack High":66,"Energy":0,"Summoned":false,"Items":[{"Name":"Rough Skin","Tier":3}]}],[{"Character":"Emilia","HP":175,"HP Max":175,"Speed":15,"Attack Low":15,"Attack High":25,"Energy":55,"Summoned":false,"Items":[{"Name":"Challenger Arrow","Tier":5}]},{"Character":"Rem","HP":225,"HP Max":225,"Speed":17,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Challenger Arrow","Tier":5}]},{"Character":"Ram","HP":150,"HP Max":150,"Speed":17,"Attack Low":25,"Attack High":50,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Megumin","HP":150,"HP Max":150,"Speed":18,"Attack Low":1,"Attack High":2,"Energy":40,"Summoned":false,"Items":[{"Name":"Explosion Powder","Tier":7}]},{"Character":"Aqua","HP":150,"HP Max":150,"Speed":25,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Love Letter","Tier":6}]},{"Character":"Darkness","HP":200,"HP Max":200,"Speed":15,"Attack Low":4,"Attack High":9,"Energy":0,"Summoned":false,"Items":[{"Name":"Knight\'s Lance","Tier":5},{"Name":"Magic Parasol","Tier":8},{"Name":"Poison Dagger","Tier":1}],"_stats":{"_triggeredBlock":28,"_availableBlocks":92,"_triggeredMagicParasol":62,"_defended":154}}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Boomerang Monkey","HP":225,"HP Max":225,"Speed":17,"Attack Low":24,"Attack High":32,"Energy":0,"Summoned":false,"Items":[{"Name":"Machete","Tier":8}]},{"Character":"Ice Monkey","HP":200,"HP Max":200,"Speed":20,"Attack Low":10,"Attack High":25,"Energy":999,"Summoned":false,"Items":[{"Name":"Avalanche","Tier":1}]},{"Character":"Wizard Monkey","HP":250,"HP Max":250,"Speed":10,"Attack Low":0,"Attack High":0,"Energy":999,"Summoned":false,"Items":[{"Name":"Explosion Powder","Tier":2}]}],[{"Character":"Dart Monkey 1","HP":150,"HP Max":150,"Speed":18,"Attack Low":10,"Attack High":40,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Dart Monkey 2","HP":150,"HP Max":150,"Speed":18,"Attack Low":10,"Attack High":40,"Energy":0,"Summoned":false,"Items":[]},{"Character":"Tack Shooter 1","HP":200,"HP Max":200,"Speed":18,"Attack Low":0,"Attack High":0,"Energy":0,"Summoned":false,"Items":[{"Name":"Thorns","Tier":7}]},{"Character":"Tack Shooter 2","HP":200,"HP Max":200,"Speed":18,"Attack Low":0,"Attack High":0,"Energy":0,"Summoned":false,"Items":[{"Name":"Thorns","Tier":7}]}],[{"Character":"Super Monkey","HP":375,"HP Max":375,"Speed":55,"Attack Low":20,"Attack High":35,"Energy":0,"Summoned":false,"Items":[{"Name":"Seeking Missiles","Tier":5}]},{"Character":"Monkey Village","HP":200,"HP Max":200,"Speed":20,"Attack Low":0,"Attack High":0,"Energy":999,"Summoned":false,"Items":[{"Name":"Boosting Bugle","Tier":3}]}]]')},function(e){e.exports=JSON.parse('[[{"Character":"Trundle","HP":250,"HP Max":250,"Speed":17,"Attack Low":20,"Attack High":75,"Energy":999,"Summoned":false,"Items":[{"Name":"Challenger Arrow","Tier":2},{"Name":"Draining Dagger","Tier":2}]},{"Character":"Sejuani","HP":250,"HP Max":250,"Speed":13,"Attack Low":50,"Attack High":100,"Energy":0,"Summoned":false,"Items":[{"Name":"Avalanche","Tier":4}]},{"Character":"Teemo","HP":100,"HP Max":100,"Speed":20,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Poison Dagger","Tier":5}]},{"Character":"Ezreal","HP":100,"HP Max":100,"Speed":20,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[]}],[{"Character":"Tahm Kench","HP":200,"HP Max":200,"Speed":6,"Attack Low":50,"Attack High":150,"Energy":0,"Summoned":false,"Items":[{"Name":"Rough Skin","Tier":5},{"Name":"Healing Pendant","Tier":5},{"Name":"Magic Parasol","Tier":6}],"_stats":{"_triggeredBlock":39,"_availableBlocks":92,"_triggeredMagicParasol":20,"_defended":56}},{"Character":"Braum","HP":300,"HP Max":300,"Speed":7,"Attack Low":50,"Attack High":100,"Energy":0,"Summoned":false,"Items":[{"Name":"Rough Skin","Tier":5},{"Name":"Magic Parasol","Tier":4},{"Name":"Survival Kit","Tier":8}],"_stats":{"_triggeredBlock":38,"_availableBlocks":88,"_triggeredMagicParasol":21,"_defended":77}},{"Character":"Brand","HP":150,"HP Max":150,"Speed":11,"Attack Low":10,"Attack High":20,"Energy":0,"Summoned":false,"Items":[{"Name":"Thorns","Tier":7},{"Name":"Explosion Powder","Tier":5},{"Name":"Machete","Tier":4}]},{"Character":"Zyra","HP":150,"HP Max":150,"Speed":15,"Attack Low":5,"Attack High":25,"Energy":0,"Summoned":false,"Items":[{"Name":"Thorns","Tier":7},{"Name":"Machete","Tier":4},{"Name":"Imp Whistle","Tier":8}]},{"Character":"Sona","HP":150,"HP Max":150,"Speed":12,"Attack Low":20,"Attack High":30,"Energy":0,"Summoned":false,"Items":[{"Name":"Energetic Ally","Tier":5},{"Name":"Love Letter","Tier":7}]}],[{"Character":"Riven","HP":500,"HP Max":500,"Speed":20,"Attack Low":40,"Attack High":90,"Energy":0,"Summoned":false,"Items":[{"Name":"Machete","Tier":9},{"Name":"Big Club","Tier":9}],"_stats":{"_triggeredBigClub":7,"_attacks":7}},{"Character":"Yasuo","HP":250,"HP Max":250,"Speed":20,"Attack Low":1,"Attack High":150,"Energy":0,"Summoned":false,"Items":[]}]]')},function(e,a,t){var r={"./season_2/items/passive_items.json":8};function n(e){var a=o(e);return t(a)}function o(e){if(!t.o(r,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return r[e]}n.keys=function(){return Object.keys(r)},n.resolve=o,e.exports=n,n.id=29},function(e,a,t){var r={"./season_2/items/energy_items.json":7};function n(e){var a=o(e);return t(a)}function o(e){if(!t.o(r,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return r[e]}n.keys=function(){return Object.keys(r)},n.resolve=o,e.exports=n,n.id=30},function(e,a,t){var r={"./season_2/mobs/summon_templates.json":9};function n(e){var a=o(e);return t(a)}function o(e){if(!t.o(r,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return r[e]}n.keys=function(){return Object.keys(r)},n.resolve=o,e.exports=n,n.id=31},,function(e,a,t){"use strict";t.r(a);var r=t(4),n=t.n(r),o=t(10),i=t.n(o),s=t(2);t(11),t(12),t(3),t(0);var c=t(1);var m=function(){var e=Object(r.useState)("Click the button to start a test run!"),a=Object(s.a)(e,2),t=a[0],n=a[1];return Object(c.jsxs)("div",{children:[Object(c.jsx)("button",{onClick:function(){n("Test run finished!")},children:"Run Test"}),Object(c.jsx)("div",{children:t})]})};var g=function(){return Object(c.jsxs)("div",{children:["Hello World!",Object(c.jsx)("br",{}),Object(c.jsx)(m,{})]})};i.a.render(Object(c.jsx)(n.a.StrictMode,{children:Object(c.jsx)(g,{})}),document.getElementById("root"))}],[[33,1,2]]]);
//# sourceMappingURL=main.cfd46de9.chunk.js.map