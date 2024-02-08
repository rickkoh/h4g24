import { Drawer, DrawerProps } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SortableList } from "./sortable/SortableList";

interface Props extends DrawerProps {}
export default function TestComponentOne(props: Props) {
  const [items, setItems] = useState([{ id: "1" }, { id: "2" }, { id: "3" }]);
  const { register, handleSubmit } = useForm();

  function submit(a: any) {
    console.log(a);
  }

  return (
    <Drawer {...props} width={756}>
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            <div className="w-full bg-red-200 flex flex-row">
              <p className="w-full">{item.id}</p>
              <div className="justify-self-end">
                <SortableList.DragHandle />
              </div>
            </div>
          </SortableList.Item>
        )}
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <input
          type="text"
          placeholder="First name"
          {...register("First name", { required: true, maxLength: 80 })}
        />
        <input
          type="text"
          placeholder="Last name"
          {...register("Last name", { required: true, maxLength: 100 })}
        />
        <input
          type="text"
          placeholder="Email"
          {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        <input
          type="tel"
          placeholder="Mobile number"
          {...register("Mobile number", {
            required: true,
            minLength: 6,
            maxLength: 12,
          })}
        />
        <select {...register("Title", { required: true })}>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>

        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="Yes"
        />
        <input
          {...register("Developer", { required: true })}
          type="radio"
          value="No"
        />

        <input type="submit" />
      </form>
    </Drawer>
  );
}
