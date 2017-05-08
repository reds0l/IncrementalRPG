// Jared Rodgers
// Main.js

'use strict';

/**
 * *****************************************************
 * Section (#1): Classes
 * This section contains all the classes
 * Since classes aren't pushed to the top like functions
 * they must come first.
 * *****************************************************
 */

/**
 * Weapon Class
 */
class Weapon {
    /**
     * Constructor
     * @param {int} id - id number of weapon
     * @param {string} title - name of the weapon
     * @param {string} rarity - rarity of the weapon
     * @param {int} attack - attack value of the weapon
     */
    constructor(id, title, rarity, attack, image) {
        this.id = id;
        this.title = title;
        this.rarity = rarity;
        this.attack = attack;
        this.img = image;
    }
}

/**
 * Character Class
 */
class Hero {
    /**
     * Constructor
     */
    constructor() {
        this.name = 'Craig';
        this.level = 0;
        this.curXP = 0;
        this.maxXP = 2;
        this.curHealth = 10;
        this.maxHealth = 10;
        this.defense = 3;
        this.weapon = new Weapon(0, 'Stick', COMMON, 1, 'katana.png');
    }

    /**
     * Update XP and level based on passed amount
     * @param {int} xp - amount of xp to add
     */
    updateXP(xp) {
        this.curXP = this.curXP + xp;
        if (this.curXP >= this.maxXP) {
            this.curXP = 0;
            this.maxXP = this.maxXP * 2;
            this.levelUp();
        }
    }

    /**
     * level up
     */
    levelUp() {
        this.level++;
        console.log('Level Up');
        updateLog('Level Up!');
        this.maxHealth = this.maxHealth + 4 * this.level;
        this.curHealth = this.maxHealth;
        this.defense = this.defense + this.level;
    }
}

/**
 * Enemy Class
 */
class Enemy {
    /**
     * Constructor
     */
    constructor() {
        this.name = 'Rat';
        this.level = 1;
        this.curHealth = 5;
        this.maxHealth = 5;
        this.defense = 1;
        this.attack = 3;
    }

    /**
     * set the Stats for this character
     * @param {int} curHealth - current health
     * @param {int} maxHealth - max health
     * @param {int} defense - defense
     * @param {Weapon} attack - attack
     */
    setStats(curHealth, maxHealth, defense, attack) {
        if(curHealth != null) {
            this.curHealth = curHealth;
        }
        if(maxHealth != null) {
            this.maxHealth = maxHealth;
        }
        if(defense != null) {
            this.defense = defense;
        }
        if(attack != null) {
            this.attack = attack;
        }
    }

    /**
     * set name for this enemy
     * @param {string} n - name
     */
    setName(n) {
        this.name = n;
    }
}
/**
 * *****************************************************
 * Section (#2): Global Variables
 * This section contains all Global Variables
 * The two important ones are the hero and enemy objects
 * Some will constantly be updated as battles happen
 * *****************************************************
 */
const COMMON = 'common';
const RARE = 'rare';
const EPIC = 'epic';
const LEGENDARY = 'legendary';

const LOOTCHANCE = 40;
const SPEEDUP = 2;
/*
 * not sure if this is worth or not
 let game = {
 globalID: 0,
 battleFlag: false,
 level: false,
 };
 */
let globalID = 1;           // Used to generate weapons with unique ids
let BATTLEFLAG = false;
let level = 1;
let inventory = [];

let hero = new Hero();      // hero character
let enemy = new Enemy();    // enemy character

/**
 * *****************************************************
 * Section (#3): Functions
 * This section contains all functions
 * Each function's JSDoc comment tells what it does
 * *****************************************************
 */

/**
 * sets Battleflag to true
 */
function startBattle() {
    if (isDead(enemy)) {
        updateLog('You pummel your fallen foe,'
                + ' but there is nothing more to gain.');
    } else if (isDead(hero)) {
        updateLog('You have no strength left to battle.');
    } else {
        BATTLEFLAG = true;
    }
}

/**
 * Generates a random Weapon
 * @return {Weapon}
 */
function generateWeapon() {
    let id = globalID;
    let title = generateWeaponName();
    let img = generateWeaponImg();
    let rarity = generateRarity();
    let attack = generateAttack(rarity);
    console.log('name: ' + title);
    console.log('rarity: ' + rarity);
    console.log('attack: ' + attack);
    let w = new Weapon(id, title, rarity, attack, img);
    globalID++;
    return w;
}

/**
 * Generates a rarity based on random number
 * @return {string}
 */
function generateRarity() {
    let r = 1000 * Math.random();
    if (r < 750) {                      // 75% chance for common
        return COMMON;
    } else if (r >= 750 && r < 950) {   // 20% chance for rare
        return RARE;
    } else if (r >= 950 && r < 995) {   // 4.5% chance for epic
        return EPIC;
    } else if (r >= 995 && r <= 1000) { // .5% chance for legendary
        return LEGENDARY;
    }
}

/**
 * Generates attack based on rarity
 * @param {string} rarity - rarity of the weapon
 * @return {int}
 */
function generateAttack(rarity) {
    let mod;
    let attack;
    if (rarity === COMMON) {
        mod = 1;
    } else if (rarity === RARE) {
        mod = 2;
    } else if (rarity === EPIC) {
        mod = 3;
    } else if (rarity === LEGENDARY) {
        mod = 5;
    }
    attack = Math.trunc(((Math.random() * 3) + 3) * mod * level);
    return attack;
}

/**
 * Generates name for weapon
 * @return {string}
 */
function generateWeaponName() {
    let metals = ['Iron', 'Steel', 'Copper', 'Bronze', 'Stone'];
    let wpns = ['Sword', 'Blade', 'Longsword', 'Dagger', 'Knife'];
    let wpn = wpns[Math.floor(Math.random() * metals.length)];
    let metal = metals[Math.floor(Math.random() * wpns.length)];
    return metal + ' ' + wpn + ' (lvl ' + level + ')';
}

/**
 * Generates name for weapon
 * @return {string}
 */
function generateWeaponImg() {
    let imgs = ['broad-dagger.png', 'broadsword.png', 'katana.png',
    'shard-sword.png', 'stiletto.png', 'two-handed-sword.png'];
    let img = imgs[Math.floor(Math.random() * imgs.length)];
    return img;
}

/**
 * Generates an enemy
 */
function generateEnemy() {
    // Reset enemy death if not reset
    if ($('.dead-enemy').hasClass('dead-animate')) {
        resetEnemyDeath();
    }
    // Create new enemy and set it's stats based on GAME LEVEL
    enemy = new Enemy();
    let stats = generateEnemyStats();
    enemy.setStats(stats.health, stats.health, stats.defense, stats.attack);
    enemy.setName(generateEnemyName());
    updateView();
}

/**
 * Generates enemy name
 * @return {string}
 */
function generateEnemyName() {
    let names = ['Rat', 'Skeleton', 'Wolf', 'Ooze', 'Rock Monster'];
    let name = names[Math.floor(Math.random() * names.length)];
    return name;
}

/**
 * Generates enemy name
 * @return {object}
 */
function generateEnemyStats() {
    let s = {
        health: (Math.trunc(Math.random() * 2 * level)) + 5 * level,
        attack: (Math.trunc(Math.random() * 2 * level)) + 3 * level,
        defense: (Math.trunc(Math.random() * 2 * level)) + level,
    };
    return s;
}

/**
 * Decides if loot will drop or not
 */
function dropLoot() {
    let r = 100 * Math.random();
    if (r < LOOTCHANCE) {       // 40% chance for loot
        console.log('Dropping Loot');
        let w = generateWeapon();
        inventory.push(w);
    }
}

/**
 * Check if a character is dead
 * @param {Character} x - any character (hero or enemy class)
 * @return {boolean}
 */
function isDead(x) {
    if (x.curHealth <= 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * If character defeats enemy
 */
function battleVictory() {
    console.log('Victory');
    dropLoot();
    let xp = Math.trunc((Math.random() * level) + level);
    hero.updateXP(xp);

    // update the log
    updateLog('Gained: ' + xp + 'xp');
    updateLog('Craig defeated ' + enemy.name + '.');
}

/**
 * Rests character restoring health to max (while not in combat)
 */
function restHero() {
    if (BATTLEFLAG) {
        updateLog('Cannot rest during combat.');
    } else {
        updateLog('Resting.');
        hero.curHealth = hero.maxHealth;
    }
}

/**
 * Equips the click upon weapon to the hero
 * @param {object} e - e.target.id = weaponImg#
 */
function equipWeapon(e) {
    let weaponID = e.target.id.replace('weaponImg', '');
    let i;
    for (i=0; i<inventory.length; i++) {
        if (inventory[i].id == weaponID) {
            if (hero.weapon instanceof Weapon) {
                // put weapon back in inventory
                // equip new weapon
                console.log('Weapon detected. Replacing Weapon');
                let temp = inventory[i];
                inventory[i] = hero.weapon;
                hero.weapon = temp;
            } else {
                console.log('No weapon detected. Equiping Weapon');
                hero.weapon = inventory[i];
            }
        }
    }
    updateView();
}

/**
 * Updates character stuff
 */
function updateBattle() {
    if (BATTLEFLAG) {
        console.log('Battle Flag Active');
        // calculate damage
        let heroDamage = hero.weapon.attack - enemy.defense;
        let enemyDamage = enemy.attack - hero.defense;
        if (heroDamage < 1) {
            heroDamage = 1;
        }
        if (enemyDamage < 1) {
            enemyDamage = 1;
        }
        // update health
        hero.curHealth = hero.curHealth - enemyDamage;
        enemy.curHealth = enemy.curHealth - heroDamage;
        if (isDead(hero)) {
            console.log('Hero Dead');
            BATTLEFLAG = false;
        } else if (isDead(enemy)) {
            console.log('Enemy Dead');
            enemy.curHealth = 0;
            BATTLEFLAG = false;
            battleVictory();
        }
    }
}

/**
 * Updates character stuff
 */
function updateCharacter() {
    // update character stats
    // update inventory
}

/**
 * Updates view stuff*
 */
function updateView() {
    // Update character view info
    $('#characterHealth').html('Health: ' + hero.curHealth + '/'
            + hero.maxHealth);
    $('#characterLevel').html('Level: ' + hero.level);
    $('#characterXP').html('XP: ' + hero.curXP + '/'
            + hero.maxXP);
    $('#characterAttack').html('Attack: ' + hero.weapon.attack);
    $('#characterDefense').html('Defense: ' + hero.defense);
    $('#characterWeapon').html('Weapon: ' + hero.weapon.title);
    $('#characterRarity').html('Rarity: ' + hero.weapon.rarity);

    // Update enemy view info
    if (isDead(enemy)) {
        if (!$('.dead-enemy').hasClass('dead-animate')) {
            startEnemyDeath();
        }
    }
    $('#enemyName').html('Name: ' + enemy.name);
    $('#enemyHealth').html('Health: ' + enemy.curHealth + '/'
            + enemy.maxHealth);
    $('#enemyAttack').html('Attack: ' + enemy.attack);
    $('#enemyDefense').html('Defense: ' + enemy.defense);

    // Update inventory view info
    let i;
    let item;
    let img;
    let div;
    let p1;
    let p2;
    let p3;
    $('#inventoryBody').empty();
    for (i = 0; i < inventory.length; i++) {
        item = inventory[i];
        div = $('<div id="weapon' + item.id + '"> </div>)');
        $('#inventoryBody').prepend(div);
        img = $('<img src="assets/' + item.img + '" id="weaponImg' + item.id
                + '" class="inv-img w3-round w3-hover-opacity">');
        p1 = $('<p class="inv-text"> Name: '
                + item.title + '<br></p>');
        p2 = $('<p class="inv-text"> Rarity: '
                + item.rarity + '<br></p>');
        p3 = $('<p class="inv-text"> Attack: '
                + item.attack + '<br></p>');
        $('#weapon'+item.id).append(img);
        $('#weapon'+item.id).append(p1);
        $('#weapon'+item.id).append(p2);
        $('#weapon'+item.id).append(p3);

        $('#weaponImg'+item.id).click(equipWeapon);
    }
}

/**
 * Updates log message
 * @param {string} m - the message to display
 */
function updateLog(m) {
    let logMessage = $('<p>' + m + '<p>');
    $('#logBody').prepend(logMessage);
}

/**
 * Updates level
 */
function updateLevel() {
    level = parseInt($('#level').val());
}

/**
 * Updates stuff
 */
function update() {
    updateBattle();
    updateCharacter();
    updateView();
}

/**
 * Setup html
 */
function setup() {
    console.log('Info: Setting up Game');

    // sets initial enemy stats
    enemy.setStats(4, 4, 3, 1);

    // sets up some buttons
    $('#btn2').click(generateEnemy);
    $('#btn3').click(startBattle);
    $('#btn4').click(restHero);
    $('#level').on('input', updateLevel);
}

/**
 * Drops the enemy dead symbol
 * @param {object} x - ?
 */
function startEnemyDeath(x) {
    $('.dead-enemy').addClass('dead-animate');
}

/**
 * Reset enemy death
 * @param {object} x - ?
 */
function resetEnemyDeath(x) {
    $('.dead-enemy').removeClass('dead-animate');
}

/**
 * Username form submit handler
 */
function handleUsernameSubmit() {
    var modal = $("#userNameModal");
    var field = $("#recipient-name");
    var form_group = $("#username-form-group");
    var name = $("#recipient-name").val();
    var error_field = $(".username-error-msg");
    if (name !== "Craig" && name !== "craig") {
        form_group.addClass("has-error");
        var choices = ["Not a worthy name.", "No.", "Try again.", "Really."];
        var choice = choices[Math.floor(Math.random() * choices.length)];
        error_field.text(choice);
    } else {
        modal.modal("hide");
        console.log('Info: Starting Game');
        setup();
        setInterval(update, 1000/SPEEDUP);
    }
}

/**
 * *****************************************************
 * Section (#4): Main
 * This section contains the main code to run
 * This intializes and runs the game
 * *****************************************************
 */
$(document).ready(function() {
    // Show Choose username modal
    $("#userNameModal").modal("show");
    $("#userNameModalSubmitButton").click(handleUsernameSubmit);
    $("#username-submit-form").submit(function(e) {
        e.preventDefault();
        handleUsernameSubmit();
    });
});
