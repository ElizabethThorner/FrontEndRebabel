describe('Expected User Interface Elements', () => {
    it('should have the title reBabel', async () => {
        const title = await browser.getTitle()
        await expect(title).toBe('reBabel')
    })

    it('should have a Convert button that is clickable', async () => {
        const convertButton = await $('#convertBtn')
        await expect(convertButton).toBeClickable()
    })

    it('should have a Browse button that is clickable', async () => {
        const browseButton = await $('#file-in-btn')
        await expect(browseButton).toBeClickable()
    })

    it('should have six input file options to select', async () => {
        const fileInputType = await $('[name="inputType"]')
        await expect(fileInputType).toHaveChildren({ eq: 7 }) // One file input option is blank. 
    })

    it('should have three output file options to select', async () => {
        const fileOutputType = await $('[name="outputType"]')
        await expect(fileOutputType).toHaveChildren({ eq: 4 }) // One file output option is blank. 
    })
})

describe('Expected Functionality', () => {
    it('should indicate a file needs to be selected when the Convert button is clicked and no file is selected', async () => {
        const convertButton = await $('#convertBtn')
        convertButton.click()

        const selectFileMessage = await $('small')

        await expect(selectFileMessage).toHaveText('Select a File')
        await expect(selectFileMessage).toBeDisplayed()
    })

    it('should allow the user to select an input file type', async () => {
        const selectBox = await $('[name="inputType"]')
        await selectBox.selectByVisibleText('ELAN');

        const selectedOption = await $('[value="elan"]');
        const isSelected = await selectedOption.isSelected()

        expect(isSelected).toBe(true)
    })

    it('should allow the user to select an output file type', async () => {
        const selectBox = await $('[name="outputType"]')
        await selectBox.selectByVisibleText('Conllu');

        const selectedOption = await $('[value="conllu"]');
        const isSelected = await selectedOption.isSelected()

        expect(isSelected).toBe(true)
    })
})