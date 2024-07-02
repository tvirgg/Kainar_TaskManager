export const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    isEditing: boolean,
    handleAddTask: () => void,
    handleUpdateTask: () => void
) => {
    if (event.key === 'Enter') {
        if (isEditing) {
            handleUpdateTask();
        } else {
            handleAddTask();
        }
    }
};

export const handleJsonKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    handleJsonSubmit: () => void
) => {
    if (event.key === 'Enter') {
        handleJsonSubmit();
    }
};
