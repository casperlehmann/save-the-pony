export const contains_pony = (columnIndex, rowIndex, width, pony_pos) => {
    return rowIndex * width + columnIndex === pony_pos
}

export const contains_domo = (columnIndex, rowIndex, width, domo_pos) => {
    return rowIndex * width + columnIndex === domo_pos
}

export const contains_exit = (columnIndex, rowIndex, width, exit_pos) => {
    return rowIndex * width + columnIndex === exit_pos
}
