import { phonemize } from "phonemizer"

export function convert(input: HTMLInputElement,
    button: HTMLButtonElement,
    result: HTMLElement,
) {
    button.addEventListener('click', async ()=>{
        // 1. read the typed text
        const inputText = input.value
        // 2. convert it
        const ipas =  await phonemize(inputText)
        // 3. get result
        result.innerText = ipas.join('')
    })
}
