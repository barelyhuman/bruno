/** JSON Schema for the palette form of a custom theme upload. */
const colorString = { type: 'string', minLength: 1 };

const paletteSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    // Either base or mode is enough: base implies mode; mode alone defaults base to light/dark.
    mode: { type: 'string', enum: ['light', 'dark'] },
    base: { type: 'string', minLength: 1 },
    palette: {
      type: 'object',
      additionalProperties: false,
      properties: {
        primary: {
          type: 'object',
          additionalProperties: false,
          properties: {
            solid: colorString,
            text: colorString,
            strong: colorString,
            subtle: colorString
          }
        },
        // Semantic hue ramp used to derive request methods, status, syntax, etc.
        hues: {
          type: 'object',
          additionalProperties: false,
          properties: {
            red: colorString,
            rose: colorString,
            brown: colorString,
            orange: colorString,
            yellow: colorString,
            lime: colorString,
            green: colorString,
            greenDark: colorString,
            teal: colorString,
            cyan: colorString,
            blue: colorString,
            indigo: colorString,
            violet: colorString,
            purple: colorString,
            pink: colorString
          }
        },
        system: {
          type: 'object',
          additionalProperties: false,
          properties: {
            controlAccent: colorString
          }
        },
        background: {
          type: 'object',
          additionalProperties: false,
          properties: {
            base: colorString,
            mantle: colorString,
            crust: colorString,
            surface0: colorString,
            surface1: colorString,
            surface2: colorString
          }
        },
        text: {
          type: 'object',
          additionalProperties: false,
          properties: {
            base: colorString,
            subtext2: colorString,
            subtext1: colorString,
            subtext0: colorString
          }
        },
        overlay: {
          type: 'object',
          additionalProperties: false,
          properties: {
            overlay2: colorString,
            overlay1: colorString,
            overlay0: colorString
          }
        },
        border: {
          type: 'object',
          additionalProperties: false,
          properties: {
            border2: colorString,
            border1: colorString,
            border0: colorString
          }
        },
        utility: {
          type: 'object',
          additionalProperties: false,
          properties: {
            white: colorString,
            black: colorString
          }
        },
        intent: {
          type: 'object',
          additionalProperties: false,
          properties: {
            info: colorString,
            success: colorString,
            warning: colorString,
            danger: colorString
          }
        },
        syntax: {
          type: 'object',
          additionalProperties: false,
          properties: {
            definition: colorString,
            property: colorString,
            string: colorString,
            number: colorString,
            atom: colorString,
            variable: colorString,
            keyword: colorString,
            comment: colorString,
            operator: colorString,
            tag: colorString,
            tagBracket: colorString
          }
        },
        textLink: colorString,
        draftColor: colorString
      }
    },
    overrides: { type: 'object' },
    theme: { type: 'object' }
  },
  anyOf: [{ required: ['base'] }, { required: ['mode'] }],
  required: ['palette']
};

export default paletteSchema;
