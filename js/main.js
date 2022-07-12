/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
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

let searchStatus = 0;
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

const pane = new Array(5).fill(0).map(() => new Array(6).fill(0));
const searchPane = new Array(5).fill(0).map(() => new Array(6).fill(0));

const changeMode = (mode) => {
    tapMode = mode;
};

const changeEdit = (editCmd) => {
    editCommand = editCmd;
    editBtns.forEach((b) => {
        b.classList.add('cmd-unselect');
    });
    switch (editCmd) {
    case COMMAND_TYPE.SWORD:
        editSword.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.ARCH:
        editArch.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.MAGIC:
        editMagic.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.HEAL:
        editHeal.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.INVALID:
        editInvalid.classList.remove('cmd-unselect');
        break;
    case COMMAND_TYPE.STONE:
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
    searchStatus = 0;
    Array(5).fill(0).forEach((_, row) => {
        Array(6).fill(0).forEach((__, col) => {
            pane[row][col] = (Math.floor(Math.random() * 4) + 1) * 100;
            searchPane[row][col] = SEARCH_TYPE.EMPTY;
        });
    });
};

const refreshPaneImage = () => {
    let newPane = '';
    Array(5).fill(0).forEach((_, row) => {
        Array(6).fill(0).forEach((__, col) => {
            const path = getCommandImagePath(pane[row][col]);
            newPane += `<div class="pane-grid
                            ${searchPane[row][col] > SEARCH_TYPE.START ? 'pane-grid-onselect' : ''}
                            ${searchPane[row][col] === SEARCH_TYPE.START ? 'pane-grid-onselect-start' : ''}"
                            onClick="clickCommand(${row}, ${col});
                        ">
                        <img src="${path}" class="img-fluid">
                        ${searchPane[row][col] >= SEARCH_TYPE.START ? `<div class="command-number">${searchPane[row][col] - SEARCH_TYPE.START + 1}</div>` : ''}
                        </div>`;
        });
    });
    paneDisplay.innerHTML = newPane;
};

const refreshSearchPane = () => {
    pane.forEach((rows, row) => {
        rows.forEach((value, col) => {
            if (value === COMMAND_TYPE.STONE) {
                searchPane[row][col] = SEARCH_TYPE.UNSELECTABLE;
            }
        });
    });
};

const updateSearchPane = (row, col) => {
    if (searchPane[row][col] === SEARCH_TYPE.EMPTY) {
        searchPane[row][col] = SEARCH_TYPE.START + searchStatus;
        searchStatus += 1;
    } else if (searchPane[row][col] >= SEARCH_TYPE.START) {
        const calcelNumber = searchPane[row][col];
        let calcelCount = 0;
        searchPane.forEach((rows, rowIdx) => {
            rows.forEach((value, colIdx) => {
                if (value >= calcelNumber) {
                    searchPane[rowIdx][colIdx] = SEARCH_TYPE.EMPTY;
                    calcelCount += 1;
                }
                if (value > calcelNumber) {
                    switch (pane[rowIdx][colIdx]) {
                    case COMMAND_TYPE.SWORD:
                        pane[rowIdx][colIdx] = COMMAND_TYPE.ARCH;
                        break;
                    case COMMAND_TYPE.ARCH:
                        pane[rowIdx][colIdx] = COMMAND_TYPE.SWORD;
                        break;
                    case COMMAND_TYPE.MAGIC:
                        pane[rowIdx][colIdx] = COMMAND_TYPE.HEAL;
                        break;
                    case COMMAND_TYPE.HEAL:
                        pane[rowIdx][colIdx] = COMMAND_TYPE.MAGIC;
                        break;
                    case COMMAND_TYPE.STONE:
                        break;
                    case COMMAND_TYPE.POISON:
                    case COMMAND_TYPE.INVALID:
                        break;
                    default:
                        break;
                    }
                }
            });
        });
        refreshPaneImage();
        searchStatus -= calcelCount;
    }
};

const clickCommand = (gridRow, gridCol) => {
    if (tapMode === TAP_MODE.PLAYING) {
        switch (pane[gridRow][gridCol]) {
        case COMMAND_TYPE.SWORD:
            pane[gridRow][gridCol] = COMMAND_TYPE.ARCH;
            updateSearchPane(gridRow, gridCol);
            break;
        case COMMAND_TYPE.ARCH:
            pane[gridRow][gridCol] = COMMAND_TYPE.SWORD;
            updateSearchPane(gridRow, gridCol);
            break;
        case COMMAND_TYPE.MAGIC:
            pane[gridRow][gridCol] = COMMAND_TYPE.HEAL;
            updateSearchPane(gridRow, gridCol);
            break;
        case COMMAND_TYPE.HEAL:
            pane[gridRow][gridCol] = COMMAND_TYPE.MAGIC;
            updateSearchPane(gridRow, gridCol);
            break;
        case COMMAND_TYPE.STONE:
            break;
        case COMMAND_TYPE.POISON:
        case COMMAND_TYPE.INVALID:
            updateSearchPane(gridRow, gridCol);
            break;
        default:
            break;
        }
        refreshPaneImage();
        stepCount.value = searchStatus;
    } else if (tapMode === TAP_MODE.EDITING) {
        pane[gridRow][gridCol] = editCommand;
        refreshPaneImage();
    }
};

const paneTidy = (currentPane) => {
    for (let col = 0; col <= 5; col += 1) {
        let colsCmd = [
            currentPane[4][col], currentPane[3][col], currentPane[2][col],
            currentPane[1][col], currentPane[0][col],
        ];
        colsCmd = colsCmd.filter((cmd) => cmd !== COMMAND_TYPE.EMPTY);
        while (colsCmd.length > 0 && colsCmd[0] === COMMAND_TYPE.STONE) {
            colsCmd.shift();
        }
        if (colsCmd.length < 5) {
            colsCmd = colsCmd.concat(Array(5 - colsCmd.length).fill(0));
        }
        for (let row = 4; row >= 0; row -= 1) {
            currentPane[row][col] = colsCmd[4 - row];
        }
    }
    return currentPane;
};

const findSameCommand = (row, col, inputPane) => {
    const currentPane = inputPane.map((r) => r.slice());
    const processing = [{ row, col }];
    const tobeRemoved = [];
    const targetCommand = currentPane[row][col];
    while (processing.length > 0) {
        const target = processing.shift();
        const currentRow = target.row; const
            currentCol = target.col;
        if (currentRow > 0) {
            if (currentPane[currentRow - 1][currentCol] === targetCommand) {
                processing.push({ row: currentRow - 1, col: currentCol });
            } else if (currentPane[currentRow - 1][currentCol] === COMMAND_TYPE.INVALID) {
                tobeRemoved.push({ row: currentRow - 1, col: currentCol });
            }
        }
        if (currentRow < 4) {
            if (currentPane[currentRow + 1][currentCol] === targetCommand) {
                processing.push({ row: currentRow + 1, col: currentCol });
            } else if (currentPane[currentRow + 1][currentCol] === COMMAND_TYPE.INVALID) {
                tobeRemoved.push({ row: currentRow + 1, col: currentCol });
            }
        }
        if (currentCol > 0) {
            if (currentPane[currentRow][currentCol - 1] === targetCommand) {
                processing.push({ row: currentRow, col: currentCol - 1 });
            } else if (currentPane[currentRow][currentCol - 1] === COMMAND_TYPE.INVALID) {
                tobeRemoved.push({ row: currentRow, col: currentCol - 1 });
            }
        }
        if (currentCol < 5) {
            if (currentPane[currentRow][currentCol + 1] === targetCommand) {
                processing.push({ row: currentRow, col: currentCol + 1 });
            } else if (currentPane[currentRow][currentCol + 1] === COMMAND_TYPE.INVALID) {
                tobeRemoved.push({ row: currentRow, col: currentCol + 1 });
            }
        }
        tobeRemoved.push({ row: currentRow, col: currentCol });
        currentPane[currentRow][currentCol] = COMMAND_TYPE.EMPTY;
    }
    return {
        targetCommand,
        tobeRemoved,
    };
};

const findCombo = (inputPane) => {
    const currentPane = inputPane.map((r) => r.slice()); const
        commandCount = {
            sword: 0, arch: 0, magic: 0, heal: 0,
        };
    let combo = 0;
    for (let row = 0; row <= 4; row += 1) {
        for (let col = 0; col <= 4; col += 1) {
            if (currentPane[row][col] === currentPane[row][col + 1]
                && currentPane[row][col] === currentPane[row][col + 2]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const result = findSameCommand(row, col, currentPane);
                let count = 0;
                result.tobeRemoved.forEach((pos) => {
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
    for (let col = 0; col <= 5; col += 1) {
        for (let row = 0; row <= 2; row += 1) {
            if (currentPane[row][col] === currentPane[row + 1][col]
                && currentPane[row][col] === currentPane[row + 2][col]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const result = findSameCommand(row, col, currentPane);
                let count = 0;
                result.tobeRemoved.forEach((pos) => {
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
    return { combo, currentPane, commandCount };
};

const calculateCombo = (inputPane = pane.map((r) => r.slice())) => {
    let totalCombo = 0; let combo; let
        step = 1; let currentPane = inputPane.map((r) => r.slice());
    dropResult.innerHTML = '';
    const commandCount = {
        sword: 0, arch: 0, magic: 0, heal: 0,
    };
    do {
        const result = findCombo(currentPane);
        combo = result.combo;
        Object.keys(result.commandCount).forEach((key) => {
            commandCount[key] += result.commandCount[key];
        });
        totalCombo += combo;
        currentPane = result.currentPane;
        currentPane = paneTidy(currentPane);
        if (combo > 0) {
            let newPane = `
            <h4>【STEP ${step}】→ ${combo} Combo</h4>
            <p> 消除後的版面如下</p>
            <div class="pane-wrapper">
            `;
            for (let row = 0; row < 5; row += 1) {
                for (let col = 0; col < 6; col += 1) {
                    const path = getCommandImagePath(currentPane[row][col]);
                    newPane += `<div class="pane-grid">
                                    <img src="${path}" class="img-fluid">
                                </div>`;
                }
            }
            newPane += '</div><br>';
            dropResult.innerHTML += newPane;
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
    refreshSearchPane();
    dropResult.innerHTML = '';
    comboCount.value = '尚未計算';
    swordCount.value = '尚未計算';
    archCount.value = '尚未計算';
    magicCount.value = '尚未計算';
    healCount.value = '尚未計算';
    // calculateCombo();
};

init();
