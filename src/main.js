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
    constructor(id, title, rarity, attack) {
        this.id = id;
        this.title = title;
        this.rarity = rarity;
        this.attack = attack;
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
        this.name = '';
        this.level = 0;
        this.curXP = 0;
        this.maxXP = 2;
        this.curHealth = 25;
        this.maxHealth = 25;
        this.defense = 5;
        this.weapon = generateWeapon();
    }

    /**
     * Equip Weapon
     * @param {Weapon} w - weapon to equip
     */
    equipWeapon() {
        if (this.weapon instanceof Weapon) {
            // put weapon back in inventory
            // equip new weapon
            console.log('Weapon detected. Replacing Weapon');
            inventory.push(this.weapon);
            this.weapon = w;
        } else {
            console.log('No weapon detected. Equiping Weapon');
            this.weapon = w;
        }
    }

    /**
     * Update XP and level based on passed amount
     * @param {int} xp - amount of xp to add
     */
    updateXP(xp) {
        this.curXP = this.curXP + xp;
        if (this.curXP >= this.maxXP) {
            console.log('Level Up');
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
        this.maxHealth = this.maxHealth + 4 * this.level;
        this.curHealth = this.maxHealth;
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
        this.name = '';
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
}
/**
 * *****************************************************
 * Section (#2): Global Variables
 * This section contains all Global Variables
 * The two important ones are the hero and enemy objects
 * These will constantly be updated as battles happen
 * *****************************************************
 */
const COMMON = 'common';
const RARE = 'rare';
const EPIC = 'epic';
const LEGENDARY = 'legendary';

/*
 * not sure if this is worth or not
let game = {
    globalID: 0,
    battleFlag: false,
    level: false,
};
*/
let globalID = 0;               // Used to generate weapons with unique ids
let BATTLEFLAG = false;
let level = 1;
let inventory = [];

let hero = new Hero();     // hero character
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
    BATTLEFLAG = true;
}

/**
 * Generates a random Weapon
 * @return {Weapon}
 */
function generateWeapon() {
    let id = globalID;
    let title = generateWeaponName();
    let rarity = generateRarity();
    let attack = generateAttack(rarity);
    console.log('name: ' + title);
    console.log('rarity: ' + rarity);
    console.log('attack: ' + attack);
    let w = new Weapon(id, title, rarity, attack);
    globalID++;
    return w;
}

/**
 * Generates a rarity based on random number
 * @return {string}
 */
function generateRarity() {
    let r = 1000 * Math.random();
    if (r < 800) {
        return COMMON;
    } else if (r >= 800 && r < 950) {
        return RARE;
    } else if (r >= 950 && r < 999) {
        return EPIC;
    } else if (r >= 999 && r <= 1000) {
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
    attack = Math.trunc(((Math.random() * 3) + 3) * mod);
    return attack;
}

/**
 * Generates name for weapon
 * @return {string}
 */
function generateWeaponName() {
    return 'iron sword';
}

/**
 * Generates an enemy
 */
function generateEnemy() {
    enemy = new Enemy();
    enemy.setStats(5*level, 5*level, 1*level, 3*level);
}

/**
 * Check if a character is dead
 * @param {Character} x - any character
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
    let xp = Math.trunc((Math.random() * 2) + 1);
    console.log('Gain: ' + xp + 'xp');
    // give hero xp (eventually replace with hero class xp function)
    hero.updateXP(xp);
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
    $('#enemyHealth').html('Health: ' + enemy.curHealth + '/'
            + enemy.maxHealth);
    $('#enemyAttack').html('Attack: ' + enemy.attack);
    $('#enemyDefense').html('Defense: ' + enemy.defense);

    // Update inventory view info
    let i;
    let item;
    let div;
    let p1;
    let p2;
    let p3;
    let header = $('<h3>Inventory:</h3>');
    $('#inventory').empty();
    $('#inventory').append(header);
    for (i = 0; i < inventory.length; i++) {
        item = inventory[i];
        div = $('<div id="weapon' + item.id + '"> </div>)');
        $('#inventory').append(div);
        p1 = $('<p>' + item.title + '</p>');
        p2 = $('<p>' + item.rarity + '</p>');
        p3 = $('<p>' + item.attack + '</p>');
        $('#inventory').append(p1);
        $('#inventory').append(p2);
        $('#inventory').append(p3);
    }
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
    enemy.setStats(10, 10, 1, null);

    // sets up some buttons
    $('#btn1').click(generateWeapon);
    $('#btn2').click(generateEnemy);
    $('#btn3').click(startBattle);

    // adds random weapon to inventory
    inventory.push(generateWeapon());
}

/**
 * *****************************************************
 * Section (#4): Main
 * This section contains the main code to run
 * This intializes and runs the game
 * *****************************************************
 */
$(document).ready(function() {
    console.log('Info: Starting Game');
    setup();
    setInterval(update, 1000);
});
