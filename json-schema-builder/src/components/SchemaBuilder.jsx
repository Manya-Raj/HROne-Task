import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FieldRow from "./FieldRow";

export default function SchemaBuilder() {
  const methods = useForm({
    defaultValues: {
      fields: [],
    },
  });

  const { control, handleSubmit, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const [jsonPreview, setJsonPreview] = useState({});
  const watchAll = watch();

  const generateSchema = (fields) => {
    let schema = {};
    fields.forEach((field) => {
      if (!field.key) return;
      if (field.type === "nested") {
        schema[field.key] = generateSchema(field.fields || []);
      } else {
        schema[field.key] = field.type;
      }
    });
    return schema;
  };

  useEffect(() => {
    setJsonPreview(generateSchema(watchAll.fields || []));
  }, [watchAll]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(console.log)}
        className="p-6 flex flex-col md:flex-row gap-4"
      >
        <div className="flex flex-col w-full md:w-2/3 space-y-3">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <FieldRow name={`fields[${index}]`} />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-black font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start space-y-3 mt-4">
            <button
              type="button"
              onClick={() => append({ key: "", type: "" })} // start with empty
              className="px-50 py-2 bg-blue-600 text-white text-lg rounded"
            >
              + Add Item
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-white text-black border border-black rounded hover:bg-black hover:text-white transition"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <pre className="bg-gray-100 p-4 rounded text-sm h-full overflow-auto">
            {JSON.stringify(jsonPreview, null, 2)}
          </pre>
        </div>
      </form>
    </FormProvider>
  );
}
