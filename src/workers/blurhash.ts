import { expose } from 'comlink'
import { ValidationError, encode, decode, isBlurhashValid } from 'blurhash'

expose({
    ValidationError,
    encode,
    decode,
    isBlurhashValid,
})
