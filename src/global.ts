export let isEditMode = false;

export const toggleEditMode = () => {
    isEditMode = !isEditMode;
    console.log('Edit Mode:', isEditMode);
};