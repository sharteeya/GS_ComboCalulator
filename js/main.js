/* eslint-disable no-unused-vars */
const COMMAND_TYPE = {
    SWORD: 400,
    ARCH: 300,
    MAGIC: 200,
    HEAL: 100,
    EMPTY: 0,
    INVALID: -100,
    STONE: -200,
    POISON: -300,
};

const SEARCH_TYPE = {
    UNSELECTABLE: -100,
    EMPTY: 0,
    START: 100,
};

const TAP_MODE = {
    PLAYING: 0,
    EDITING: 100,
};

const ROW_MIN_INDEX = 0;
const ROW_MAX_INDEX = 4;
const ROW_LENGTH = 5;
const COL_MIN_INDEX = 0;
const COL_MAX_INDEX = 5;
const COL_LENGTH = 6;

let searchStep = 0;
let tapMode = TAP_MODE.PLAYING;
let editCommand = COMMAND_TYPE.SWORD;

const paneDisplay = document.getElementById('pane');
const stepCount = document.getElementById('stepCount');
const editSword = document.getElementById('edit-sword');
const editArch = document.getElementById('edit-arch');
const editMagic = document.getElementById('edit-magic');
const editHeal = document.getElementById('edit-heal');
const editInvalid = document.getElementById('edit-invalid');
const editStone = document.getElementById('edit-stone');
const comboCount = document.getElementById('comboCount');
const swordCount = document.getElementById('swordCount');
const archCount = document.getElementById('archCount');
const magicCount = document.getElementById('magicCount');
const healCount = document.getElementById('healCount');
const dropResult = document.getElementById('dropResult');
const editBtns = [editSword, editArch, editMagic, editHeal, editInvalid, editStone];

const pane = new Array(ROW_LENGTH).fill(0).map(() => new Array(COL_LENGTH).fill(0));
const searchPane = new Array(ROW_LENGTH).fill(0).map(() => new Array(COL_LENGTH).fill(0));

const changeMode = (mode) => {
    tapMode = mode;
};

const changeEdit = (editCmd) => {
    editCommand = editCmd;
    editBtns.forEach((btn) => {
        btn.classList.add('cmd-unselect');
        btn.classList.remove('cmd-select');
    });
    switch (editCmd) {
    case COMMAND_TYPE.SWORD:
        editSword.classList.add('cmd-select');
        editSword.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.ARCH:
        editArch.classList.add('cmd-select');
        editArch.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.MAGIC:
        editMagic.classList.add('cmd-select');
        editMagic.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.HEAL:
        editHeal.classList.add('cmd-select');
        editHeal.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.INVALID:
        editInvalid.classList.add('cmd-select');
        editInvalid.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.STONE:
        editStone.classList.add('cmd-select');
        editStone.classList.remove('cmd-unselect');
        break;
    default:
        break;
    }
};

const getCommandImagePath = (command) => {
    switch (command) {
    case COMMAND_TYPE.SWORD:
        return './img/command-sword.png';
    case COMMAND_TYPE.ARCH:
        return './img/command-arch.png';
    case COMMAND_TYPE.MAGIC:
        return './img/command-magic.png';
    case COMMAND_TYPE.HEAL:
        return './img/command-heal.png';
    case COMMAND_TYPE.INVALID:
        return './img/command-invalid.png';
    case COMMAND_TYPE.STONE:
        return './img/command-stone.png';
    default:
        return './img/command-empty.png';
    }
};

const refreshPane = () => {
    searchStep = 0;
    for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
        for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
            pane[row][col] = (Math.floor(Math.random() * 4) + 1) * 100;
            searchPane[row][col] = SEARCH_TYPE.EMPTY;
        }
    }
};

const refreshPaneImage = () => {
    let newPaneHTML = '';
    for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
        for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
            newPaneHTML += `
            <div class="pane-grid ${searchPane[row][col] > SEARCH_TYPE.START ? 'pane-grid-onselect' : ''}
            ${searchPane[row][col] === SEARCH_TYPE.START ? 'pane-grid-onselect-start' : ''}" onClick="clickCommand(${row}, ${col});">
            <img src="${getCommandImagePath(pane[row][col])}" class="img-fluid">
            ${searchPane[row][col] >= SEARCH_TYPE.START ? `<div class="command-number">${searchPane[row][col] - SEARCH_TYPE.START + 1}</div>` : ''}
            </div>`;
        }
    }
    paneDisplay.innerHTML = newPaneHTML;
};

const resetSearchPane = (isInit = false) => {
    searchStep = 0;
    for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
        for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
            if (pane[row][col] === COMMAND_TYPE.STONE) {
                searchPane[row][col] = SEARCH_TYPE.UNSELECTABLE;
            } else if (searchPane[row][col] >= SEARCH_TYPE.START) {
                searchPane[row][col] = SEARCH_TYPE.EMPTY;
                if (!isInit) {
                    switch (pane[row][col]) {
                    case COMMAND_TYPE.SWORD:
                        pane[row][col] = COMMAND_TYPE.ARCH;
                        break;
                    case COMMAND_TYPE.ARCH:
                        pane[row][col] = COMMAND_TYPE.SWORD;
                        break;
                    case COMMAND_TYPE.MAGIC:
                        pane[row][col] = COMMAND_TYPE.HEAL;
                        break;
                    case COMMAND_TYPE.HEAL:
                        pane[row][col] = COMMAND_TYPE.MAGIC;
                        break;
                    case COMMAND_TYPE.STONE:
                    case COMMAND_TYPE.POISON:
                    case COMMAND_TYPE.INVALID:
                    default:
                        break;
                    }
                }
            }
        }
    }
    refreshPaneImage();
};

const updateSearchPane = (pos) => {
    if (searchPane[pos.row][pos.col] === SEARCH_TYPE.EMPTY) {
        searchPane[pos.row][pos.col] = SEARCH_TYPE.START + searchStep;
        searchStep += 1;
    } else if (searchPane[pos.row][pos.col] >= SEARCH_TYPE.START) {
        const calcelNumber = searchPane[pos.row][pos.col];
        let calcelCount = 0;
        for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
            for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
                if (searchPane[row][col] === calcelNumber) {
                    searchPane[row][col] = SEARCH_TYPE.EMPTY;
                    calcelCount += 1;
                } else if (searchPane[row][col] > calcelNumber) {
                    searchPane[row][col] = SEARCH_TYPE.EMPTY;
                    calcelCount += 1;
                    switch (pane[row][col]) {
                    case COMMAND_TYPE.SWORD:
                        pane[row][col] = COMMAND_TYPE.ARCH;
                        break;
                    case COMMAND_TYPE.ARCH:
                        pane[row][col] = COMMAND_TYPE.SWORD;
                        break;
                    case COMMAND_TYPE.MAGIC:
                        pane[row][col] = COMMAND_TYPE.HEAL;
                        break;
                    case COMMAND_TYPE.HEAL:
                        pane[row][col] = COMMAND_TYPE.MAGIC;
                        break;
                    case COMMAND_TYPE.STONE:
                    case COMMAND_TYPE.POISON:
                    case COMMAND_TYPE.INVALID:
                    default:
                        break;
                    }
                }
            }
        }
        refreshPaneImage();
        searchStep -= calcelCount;
    }
};

const clickCommand = (row, col) => {
    if (tapMode === TAP_MODE.PLAYING) {
        let isSelectable = false;
        if (searchStep > 0 && searchPane[row][col] === SEARCH_TYPE.EMPTY) {
            if (row > ROW_MIN_INDEX && searchPane[row - 1][col] === SEARCH_TYPE.START + searchStep - 1) isSelectable = true;
            if (row < ROW_MAX_INDEX && searchPane[row + 1][col] === SEARCH_TYPE.START + searchStep - 1) isSelectable = true;
            if (col > COL_MIN_INDEX && searchPane[row][col - 1] === SEARCH_TYPE.START + searchStep - 1) isSelectable = true;
            if (col < COL_MAX_INDEX && searchPane[row][col + 1] === SEARCH_TYPE.START + searchStep - 1) isSelectable = true;
            if (!isSelectable) {
                return;
            }
        }
        switch (pane[row][col]) {
        case COMMAND_TYPE.SWORD:
            pane[row][col] = COMMAND_TYPE.ARCH;
            updateSearchPane({ row, col });
            break;
        case COMMAND_TYPE.ARCH:
            pane[row][col] = COMMAND_TYPE.SWORD;
            updateSearchPane({ row, col });
            break;
        case COMMAND_TYPE.MAGIC:
            pane[row][col] = COMMAND_TYPE.HEAL;
            updateSearchPane({ row, col });
            break;
        case COMMAND_TYPE.HEAL:
            pane[row][col] = COMMAND_TYPE.MAGIC;
            updateSearchPane({ row, col });
            break;
        case COMMAND_TYPE.POISON:
        case COMMAND_TYPE.INVALID:
            updateSearchPane({ row, col });
            break;
        case COMMAND_TYPE.STONE:
        default:
            break;
        }
        refreshPaneImage();
        stepCount.value = searchStep;
    } else if (tapMode === TAP_MODE.EDITING) {
        pane[row][col] = editCommand;
        refreshPaneImage();
    }
};

const paneTidy = (currentPane) => {
    const newPane = currentPane.map((r) => r.slice());
    for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
        let colCommands = [newPane[4][col], newPane[3][col], newPane[2][col], newPane[1][col], newPane[0][col]];
        colCommands = colCommands.filter((cmd) => cmd !== COMMAND_TYPE.EMPTY);
        if (colCommands.length < 5) {
            colCommands = colCommands.concat(Array(5 - colCommands.length).fill(0));
        }
        for (let row = ROW_MAX_INDEX; row >= ROW_MIN_INDEX; row -= 1) {
            newPane[row][col] = colCommands[4 - row];
        }
    }
    return newPane;
};

const findSameCommand = (row, col, inputPane) => {
    const currentPane = inputPane.map((r) => r.slice());
    const processing = [{ row, col }];
    const matches = [];
    const targetCommand = currentPane[row][col];
    while (processing.length > 0) {
        const target = processing.shift();
        const currentRow = target.row; const
            currentCol = target.col;
        if (currentRow > 0) {
            if (currentPane[currentRow - 1][currentCol] === targetCommand) {
                processing.push({ row: currentRow - 1, col: currentCol });
            } else if (currentPane[currentRow - 1][currentCol] === COMMAND_TYPE.INVALID) {
                matches.push({ row: currentRow - 1, col: currentCol });
            }
        }
        if (currentRow < 4) {
            if (currentPane[currentRow + 1][currentCol] === targetCommand) {
                processing.push({ row: currentRow + 1, col: currentCol });
            } else if (currentPane[currentRow + 1][currentCol] === COMMAND_TYPE.INVALID) {
                matches.push({ row: currentRow + 1, col: currentCol });
            }
        }
        if (currentCol > 0) {
            if (currentPane[currentRow][currentCol - 1] === targetCommand) {
                processing.push({ row: currentRow, col: currentCol - 1 });
            } else if (currentPane[currentRow][currentCol - 1] === COMMAND_TYPE.INVALID) {
                matches.push({ row: currentRow, col: currentCol - 1 });
            }
        }
        if (currentCol < 5) {
            if (currentPane[currentRow][currentCol + 1] === targetCommand) {
                processing.push({ row: currentRow, col: currentCol + 1 });
            } else if (currentPane[currentRow][currentCol + 1] === COMMAND_TYPE.INVALID) {
                matches.push({ row: currentRow, col: currentCol + 1 });
            }
        }
        matches.push({ row: currentRow, col: currentCol });
        currentPane[currentRow][currentCol] = COMMAND_TYPE.EMPTY;
    }
    return {
        targetCommand,
        matches,
    };
};

const findCombo = (inputPane) => {
    const currentPane = inputPane.map((r) => r.slice());
    const commandCount = {
        sword: 0, arch: 0, magic: 0, heal: 0,
    };
    let combo = 0;
    for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
        for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX - 2; col += 1) {
            if (currentPane[row][col] === currentPane[row][col + 1]
                && currentPane[row][col] === currentPane[row][col + 2]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const result = findSameCommand(row, col, currentPane);
                let count = 0;
                result.matches.forEach((pos) => {
                    if (currentPane[pos.row][pos.col] === result.targetCommand) {
                        count += 1;
                    }
                    currentPane[pos.row][pos.col] = COMMAND_TYPE.EMPTY;
                });
                switch (result.targetCommand) {
                case COMMAND_TYPE.SWORD:
                    commandCount.sword += count;
                    break;
                case COMMAND_TYPE.ARCH:
                    commandCount.arch += count;
                    break;
                case COMMAND_TYPE.MAGIC:
                    commandCount.magic += count;
                    break;
                case COMMAND_TYPE.HEAL:
                    commandCount.heal += count;
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.error('Error occur');
                }
                combo += 1;
            }
        }
    }
    for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
        for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX - 2; row += 1) {
            if (currentPane[row][col] === currentPane[row + 1][col]
                && currentPane[row][col] === currentPane[row + 2][col]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const result = findSameCommand(row, col, currentPane);
                let count = 0;
                result.matches.forEach((pos) => {
                    if (currentPane[pos.row][pos.col] === result.targetCommand) {
                        count += 1;
                    }
                    currentPane[pos.row][pos.col] = COMMAND_TYPE.EMPTY;
                });
                switch (result.targetCommand) {
                case COMMAND_TYPE.SWORD:
                    commandCount.sword += count;
                    break;
                case COMMAND_TYPE.ARCH:
                    commandCount.arch += count;
                    break;
                case COMMAND_TYPE.MAGIC:
                    commandCount.magic += count;
                    break;
                case COMMAND_TYPE.HEAL:
                    commandCount.heal += count;
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.error('Error occur');
                }
                combo += 1;
            }
        }
    }
    for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
        let currentRow = ROW_MAX_INDEX;
        while (currentPane[currentRow][col] === COMMAND_TYPE.STONE) {
            currentPane[currentRow][col] = COMMAND_TYPE.EMPTY;
            currentRow -= 1;
            if (currentRow < 0) {
                break;
            }
        }
    }
    return { combo, currentPane, commandCount };
};

const calculateCombo = (inputPane = pane.map((r) => r.slice())) => {
    let totalCombo = 0; let
        combo; let
        step = 1; let
        currentPane = inputPane.map((r) => r.slice());
    const commandCount = {
        sword: 0, arch: 0, magic: 0, heal: 0,
    };

    dropResult.innerHTML = '';
    do {
        const result = findCombo(currentPane);
        combo = result.combo;
        Object.keys(result.commandCount).forEach((key) => {
            commandCount[key] += result.commandCount[key];
        });
        totalCombo += combo;
        currentPane = paneTidy(result.currentPane);
        if (combo > 0) {
            let newPaneHTML = `
            <h4>【STEP ${step}】→ ${combo} Combo</h4>
            <p> 消除後的版面如下</p>
            <div class="pane-wrapper">`;

            for (let row = ROW_MIN_INDEX; row <= ROW_MAX_INDEX; row += 1) {
                for (let col = COL_MIN_INDEX; col <= COL_MAX_INDEX; col += 1) {
                    newPaneHTML += `<div class="pane-grid"><img src="${getCommandImagePath(currentPane[row][col])}" class="img-fluid"></div>`;
                }
            }
            newPaneHTML += '</div><br>';
            dropResult.innerHTML += newPaneHTML;
            step += 1;
        }
    } while (combo > 0);

    comboCount.value = totalCombo;
    swordCount.value = commandCount.sword;
    archCount.value = commandCount.arch;
    magicCount.value = commandCount.magic;
    healCount.value = commandCount.heal;
};

const init = () => {
    refreshPane();
    refreshPaneImage();
    resetSearchPane(true);
    changeEdit(400);
    dropResult.innerHTML = '';
    comboCount.value = '尚未計算';
    swordCount.value = '尚未計算';
    archCount.value = '尚未計算';
    magicCount.value = '尚未計算';
    healCount.value = '尚未計算';
    stepCount.value = '';
};

init();
