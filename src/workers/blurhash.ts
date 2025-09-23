import { decode, encode, isBlurhashValid, ValidationError } from 'blurhash'
import { expose } from 'comlink'

expose({
    ValidationError,
    encode,
    decode,
    isBlurhashValid,
})
