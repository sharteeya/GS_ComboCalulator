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

const refreshPane = () => {
    Array(5).fill(0).forEach((_, row) => {
        Array(6).fill(0).forEach((__, col) => {
            pane[row][col] = (Math.floor(Math.random() * 4) + 1) * 100;
        });
    });
};

const refreshPaneImage = () => {
    let newPane = '';
    Array(5).fill(0).forEach((_, row) => {
        Array(6).fill(0).forEach((__, col) => {
            let path = '';
            switch (pane[row][col]) {
            case COMMAND_TYPE.SWORD:
                path = './img/command-sword.png';
                break;
            case COMMAND_TYPE.ARCH:
                path = './img/command-arch.png';
                break;
            case COMMAND_TYPE.MAGIC:
                path = './img/command-magic.png';
                break;
            case COMMAND_TYPE.HEAL:
                path = './img/command-heal.png';
                break;
            case COMMAND_TYPE.STONE:
                path = './img/command-stone.png';
                break;
            default:
                path = './img/command-empty.png';
            }
            newPane += `<div class="pane-grid
                            ${searchPane[row][col] > SEARCH_TYPE.START ? 'pane-grid-onselect' : ''}
                            ${searchPane[row][col] === SEARCH_TYPE.START ? 'pane-grid-onselect-start' : ''}"
                            onClick="clickCommand(${row}, ${col});
                        ">
                            <img src="${path}" class="img-fluid">
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
            });
        });
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

const searchSameCommand = (row, col, mode, currentPane) => {
    const matches = [[row, col]];
    let currentRow = row; let
        currentCol = col;
    if (mode === 'row') {
        while (currentCol > 0) {
            if (currentPane[row][currentCol] === currentPane[row][currentCol - 1]) {
                matches.push([row, currentCol - 1]);
            } else {
                break;
            }
            currentCol -= 1;
        }
        currentCol = col;
        while (currentCol < 5) {
            if (currentPane[row][currentCol] === currentPane[row][currentCol + 1]) {
                matches.push([row, currentCol + 1]);
            } else {
                break;
            }
            currentCol += 1;
        }
    } else {
        while (currentRow > 0) {
            if (currentPane[currentRow][col] === currentPane[currentRow - 1][col]) {
                matches.push([currentRow - 1, col]);
            } else {
                break;
            }
            currentRow -= 1;
        }
        currentRow = row;
        while (currentRow < 4) {
            if (currentPane[currentRow][col] === currentPane[currentRow + 1][col]) {
                matches.push([currentRow + 1, col]);
            } else {
                break;
            }
            currentRow += 1;
        }
    }
    const invalids = [];
    matches.forEach((pos) => {
        if (pos[0] > 0 && currentPane[pos[0] - 1][pos[1]] === COMMAND_TYPE.INVALID) {
            invalids.push([pos[0] - 1, pos[1]]);
        }
        if (pos[0] < 4 && currentPane[pos[0] + 1][pos[1]] === COMMAND_TYPE.INVALID) {
            invalids.push([pos[0] + 1, pos[1]]);
        }
        if (pos[1] > 0 && currentPane[pos[0]][pos[1] - 1] === COMMAND_TYPE.INVALID) {
            invalids.push([pos[0], pos[1] - 1]);
        }
        if (pos[1] < 5 && currentPane[pos[0]][pos[1] + 1] === COMMAND_TYPE.INVALID) {
            invalids.push([pos[0], pos[1] + 1]);
        }
    });
    return matches.concat(invalids);
};

const paneTidy = (currentPane) => {
    for (let col = 0; col <= 5; col += 1) {
        let colsCmd = [
            currentPane[4][col], currentPane[3][col], currentPane[2][col],
            currentPane[1][col], currentPane[0][col],
        ];
        colsCmd = colsCmd.filter((cmd) => cmd !== COMMAND_TYPE.EMPTY);
        if (colsCmd.length < 5) {
            colsCmd = colsCmd.concat(Array(5 - colsCmd.length).fill(0));
        }
        for (let row = 4; row >= 0; row -= 1) {
            currentPane[row][col] = colsCmd[4 - row];
        }
    }
    return currentPane;
};

const findCombo = (currentPane) => {
    let combo = 0;
    for (let row = 0; row <= 4; row += 1) {
        for (let col = 0; col <= 4; col += 1) {
            if (currentPane[row][col] === currentPane[row][col + 1]
                && currentPane[row][col] === currentPane[row][col + 2]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const matchRow = searchSameCommand(row, col, 'row', currentPane);
                const matchCol = [];
                matchRow.forEach((pos) => {
                    const result = searchSameCommand(pos[0], pos[1], 'col', currentPane);
                    result.forEach((r) => {
                        matchCol.push(r);
                    });
                });
                matchRow.forEach((pos) => {
                    currentPane[pos[0]][pos[1]] = COMMAND_TYPE.EMPTY;
                });
                matchCol.forEach((pos) => {
                    currentPane[pos[0]][pos[1]] = COMMAND_TYPE.EMPTY;
                });
                combo += 1;
            }
        }
    }
    for (let col = 0; col <= 5; col += 1) {
        for (let row = 0; row <= 2; row += 1) {
            if (currentPane[row][col] === currentPane[row + 1][col]
                && currentPane[row][col] === currentPane[row + 2][col]
                && currentPane[row][col] > COMMAND_TYPE.EMPTY) {
                const matchCol = searchSameCommand(row, col, 'col', currentPane);
                const matchRow = [];

                matchCol.forEach((pos) => {
                    const result = searchSameCommand(pos[0], pos[1], 'row', currentPane);
                    result.forEach((r) => {
                        matchRow.push(r);
                    });
                });
                matchRow.forEach((pos) => {
                    currentPane[pos[0]][pos[1]] = COMMAND_TYPE.EMPTY;
                });
                matchCol.forEach((pos) => {
                    currentPane[pos[0]][pos[1]] = COMMAND_TYPE.EMPTY;
                });
                combo += 1;
            }
        }
    }

    return combo;
};

const calculateCombo = (currentPane = pane.map((r) => r.slice())) => {
    let totalCombo = 0; let combo; let
        step = 1;
    dropResult.innerHTML = '';
    do {
        combo = findCombo(currentPane);
        totalCombo += combo;
        currentPane = paneTidy(currentPane);
        if (combo > 0) {
            let newPane = `<h4>【STEP ${step}】→ ${combo} Combo</h4><div class="pane-wrapper">`;
            for (let row = 0; row < 5; row += 1) {
                for (let col = 0; col < 6; col += 1) {
                    let path = '';
                    switch (currentPane[row][col]) {
                    case COMMAND_TYPE.SWORD:
                        path = './img/command-sword.png';
                        break;
                    case COMMAND_TYPE.ARCH:
                        path = './img/command-arch.png';
                        break;
                    case COMMAND_TYPE.MAGIC:
                        path = './img/command-magic.png';
                        break;
                    case COMMAND_TYPE.HEAL:
                        path = './img/command-heal.png';
                        break;
                    case COMMAND_TYPE.STONE:
                        path = './img/command-stone.png';
                        break;
                    default:
                        path = './img/command-empty.png';
                    }
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
};

const init = () => {
    refreshPane();
    refreshPaneImage();
    refreshSearchPane();
    dropResult.innerHTML = '';
    comboCount.value = '';
    // calculateCombo();
};

init();
