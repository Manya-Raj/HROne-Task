import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { useEffect } from "react";

export default function FieldRow({ name }) {
  const { register, control, setValue, watch } = useFormContext();
  const field = watch(name);
  const nestedName = `${name}.fields`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: nestedName,
  });

  useEffect(() => {
    if (field?.type !== "nested") {
      setValue(nestedName, []);
    }
  }, [field?.type, setValue, nestedName]);

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      {/* Field name input */}
      <input
        placeholder="Field name"
        {...register(`${name}.key`)}
        className="border border-gray-300 rounded px-2 py-1 w-1/3"
      />

      {/* Field type select */}
      <select
        {...register(`${name}.type`)}
        className="border border-gray-300 rounded px-3 py-1 w-[160px]"
        defaultValue=""
      >
        <option value="" disabled hidden>
          Field Type
        </option>
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="boolean">boolean</option>
        <option value="objectId">objectId</option>
        <option value="float">float</option>
        <option value="array">array</option>
        <option value="nested">nested</option>
      </select>

      {/* Required toggle */}
      <Controller
        name={`${name}.required`}
        control={control}
        render={({ field }) => (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...field}
              checked={field.value || false}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        )}
      />

      
     
      {/* Nested fields block */}
      {field?.type === "nested" && (
        <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-2 w-full">
          {fields.map((subField, i) => (
            <div key={subField.id} className="flex items-start gap-2 mb-2">
              <FieldRow name={`${nestedName}[${i}]`} />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-black text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ key: "", type: "" })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
}
