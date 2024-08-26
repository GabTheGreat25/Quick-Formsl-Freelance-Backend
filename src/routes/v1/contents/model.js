import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    fields: [
      {
        inputType: {
          type: String,
          required: true,
        },
        fieldName: {
          type: String,
          required: false,
        },
        value: [
          {
            type: String,
            required: false,
          },
        ],
        valueIndex: {
          type: Number,
          required: false,
        },
        defaultValue: {
          type: String,
          required: false,
        },
        cols: {
          type: Number,
          required: false,
        },
        title: {
          type: String,
          required: false,
        },
        placeholderText: {
          type: String,
          required: false,
        },
        isRequiredField: {
          type: Boolean,
          required: false,
          default: false,
        },
        requiredFieldColor: {
          type: String,
          required: false,
          default: "#FF0000",
        },
        requiredFieldText: {
          type: String,
          required: false,
        },
        // style: {
        //   labelColor: {
        //     type: String,
        //     required: false,
        //     default: "#000000",
        //   },
        //   borderColor: {
        //     type: String,
        //     required: false,
        //     default: "#000000",
        //   },
        //   placeholderColor: {
        //     type: String,
        //     required: false,
        //     default: "#000000",
        //   },
        //   fontFamily: {
        //     type: String,
        //     required: false,
        //     default: "Helvetica Neue",
        //   },
        //   fontStyle: {
        //     type: String,
        //     required: false,
        //     default: "Normal",
        //   },
        //   fontWeight: {
        //     type: String,
        //     required: false,
        //     default: "Regular",
        //   },
        //   textAlignment: {
        //     type: String,
        //     required: false,
        //     default: "Start",
        //   },
        //   fontColor: {
        //     type: String,
        //     required: false,
        //     default: "#000000",
        //   },
        // },
        columns: [
          {
            inputType: {
              type: String,
              required: false,
            },
            fieldName: {
              type: String,
              required: false,
            },
            value: [
              {
                type: String,
                required: false,
              },
            ],
            valueIndex: {
              type: Number,
              required: false,
            },
            defaultValue: {
              type: String,
              required: false,
            },
            cols: {
              type: Number,
              required: false,
            },
            title: {
              type: String,
              required: false,
            },
            placeholderText: {
              type: String,
              required: false,
            },
            isRequiredField: {
              type: Boolean,
              required: false,
              default: false,
            },
            requiredFieldColor: {
              type: String,
              required: false,
              default: "#FF0000",
            },
            requiredFieldText: {
              type: String,
              required: false,
            },
            // style: {
            //   labelColor: {
            //     type: String,
            //     required: false,
            //     default: "#000000",
            //   },
            //   borderColor: {
            //     type: String,
            //     required: false,
            //     default: "#000000",
            //   },
            //   placeholderColor: {
            //     type: String,
            //     required: false,
            //     default: "#000000",
            //   },
            //   fontFamily: {
            //     type: String,
            //     required: false,
            //     default: "Helvetica Neue",
            //   },
            //   fontStyle: {
            //     type: String,
            //     required: false,
            //     default: "Normal",
            //   },
            //   fontWeight: {
            //     type: String,
            //     required: false,
            //     default: "Regular",
            //   },
            //   textAlignment: {
            //     type: String,
            //     required: false,
            //     default: "Start",
            //   },
            //   fontColor: {
            //     type: String,
            //     required: false,
            //     default: "#000000",
            //   },
            // },
          },
        ],
      },
    ],
    globalStyle: {
      labelColor: {
        type: String,
        required: false,
        default: "#000000",
      },
      borderColor: {
        type: String,
        required: false,
        default: "#000000",
      },
      placeholderColor: {
        type: String,
        required: false,
        default: "#000000",
      },
      fontFamily: {
        type: String,
        required: false,
        default: "Helvetica Neue",
      },
      fontStyle: {
        type: String,
        required: false,
        default: "Normal",
      },
      fontWeight: {
        type: String,
        required: false,
        default: "Regular",
      },
      textAlignment: {
        type: String,
        required: false,
        default: "Start",
      },
      fontColor: {
        type: String,
        required: false,
        default: "#000000",
      },
    },
    isGlobal: {
      type: Boolean,
      required: false,
      default: true,
    },
    submission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.SUBMISSIONS,
      },
    ],
    title: {
      type: String,
      required: false,
      default: "Untitled Form",
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.CONTENTS] ||
  mongoose.model(RESOURCE.CONTENTS, schema);
