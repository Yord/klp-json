const {anything, array, assert, constant, integer, oneof, property, string, unicodeString} = require('fast-check')

const chunkers = require('.')
const jsonObj  = chunkers.find(({name}) => name === 'jsonObj')
const chunker  = jsonObj.func

test('chunks data into valid json objects and leaves out everything in between while returning the rest, without lines', () => {
  const err          = []
  const argv         = {verbose: 0}
  const offset       = anything()
  const lines        = []
  const chunksOthers = integer(0, 20).chain(len =>
    array(integer(0, 5), len, len).chain(depths =>
      (len === 0 ? array(jsonObject(0), 0, 0)
                 : array(oneof(...depths.map(d => jsonObject(d))), len, len)).chain(chunks =>
        array(string().map(str => str.replace(/{/g, '')), len + 1, len + 1).chain(others =>
          constant({chunks, others})
        )
      )
    )
  )

  assert(
    property(chunksOthers, offset, ({chunks, others}, offset) => {
      const rest     = others[others.length - 1]
      const data     = (chunks.map((chunk, index) => others[index] + chunk).join('') + rest).replace(/\\/g, '\\\\')
      const lastLine = offset

      expect(
        chunker(argv)(data, offset)
      ).toStrictEqual(
        {err, chunks: chunks.map(t => t.replace(/\\/g, '\\\\')), lines, lastLine, rest: rest.replace(/\\/g, '\\\\')}
      )
    })
  )
})

test('chunks data into valid json objects and leaves out everything in between while returning the rest, with lines', () => {
  const err      = []
  const argv     = {verbose: 1}
  const chunks   = ['{"foo": "bar\n\nbaz"}', '{"foo": "bar\nbaz"}']
  const before   = 'vgjncvkjhx\nc\nvjb'
  const rest     = 'fcgvhbjkhj\nvgc'
  const data     = before + chunks.join('') + rest
  const offset   = 65
  const lines    = [67, 69]
  const lastLine = 69

  expect(
    chunker(argv)(data, offset)
  ).toStrictEqual(
    {err, chunks, lines, lastLine, rest}
  )
})

function jsonNumber () { return integer().map(i => i.toString()) }
function jsonString () { return unicodeString().map(s => '"' + s.replace(/"/g, '') + '"') }
function jsonFalse  () { return constant('false') }
function jsonTrue   () { return constant('true') }
function jsonNull   () { return constant('null') }
function jsonLeaf   () { return oneof(jsonNumber(), jsonString(), jsonFalse(), jsonTrue(), jsonNull()) }

function jsonWhitespace () {
  return array(constant(' ')).map(arr => arr.join(''))
}

function jsonObject (maxDepth, depth = 0) {
  return (
    integer(0, 1).chain(len =>
      array(jsonString(), len, len).chain(keys =>
        array(depth < maxDepth ? jsonValue(maxDepth, depth + 1) : jsonLeaf(), len, len).chain(values =>
          array(jsonWhitespace(), len * 2 + 1, len * 2 + 1).map(ws =>
            '{' +
            (len === 0 ? ws[0]
                        : keys.map((key, index) => ws[index * 2] + key + ws[index * 2 + 1] + ':' + values[index]).join(',')) +
            '}'
          )
        )
      )
    )
  )
}
function jsonArray  (maxDepth, depth = 0) {
  return (
    integer(0, 5).chain(len =>
      array(depth < maxDepth ? jsonValue(maxDepth, depth + 1) : jsonLeaf(), len, len).chain(values =>
        array(jsonWhitespace(), len + 1, len + 1).map(ws =>
          '[' +
          (len === 0 ? ws[0]
                      : values.join(',')) +
          ']'
        )
      )
    )
  )
}
function jsonValue  (maxDepth, depth = 0) {
  return (
    array(jsonWhitespace(), 2, 2).chain(ws =>
      oneof(jsonLeaf(), jsonObject(maxDepth, depth + 1), jsonArray(maxDepth, depth + 1)).chain(value =>
        jsonLeaf().map(leaf =>
          ws[0] +
          (depth < maxDepth ? value : leaf) +
          ws[1]
        )
      )
    )
  )
}