module.exports = {
  name: 'json',
  desc: "Serializes as (formatted) JSON using JavaScript's JSON.stringify.",
  opts: [
    {key: 'spaces', types: ['number'], args: ['-s', '--spaces'], desc: 'The number of spaces used to format JSON. If it is set to 0 (default), the JSON is printed in a single line.'},
    {key: 'keep',   types: ['json'],   args: ['-k', '--keep'],   desc: 'Determines which JSON fields are kept. If it is left out (default), all fields remain. If it is a string formatted as a JSON array, all fields in the array are kept. See the documentation of JSON.stringify for details.'}
  ],
  func
}

function func ({spaces, keep}) {
  return jsons => {
    let str   = ''
    const err = []

    for (let index = 0; index < jsons.length; index++) {
      try {
        const obj = jsons[index]
        const foo = JSON.stringify(obj, keep, spaces)
        if (typeof foo !== 'undefined') str += foo + '\n'
      } catch (e) {
        const msg = {msg: e.message}
        err.push(msg)
      }
    }

    return {err, str}
  }
}