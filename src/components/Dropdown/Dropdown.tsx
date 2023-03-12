import { Listbox, Transition } from "@headlessui/react";
import styles from "./Dropdown.module.scss";
import { Button } from "../Button/Button";
import { Check, ChevronDown } from "react-feather";
import cn from "classnames";
import { Fragment, ReactNode, useMemo } from "react";

export interface DropdownListItem {
  id: string;
  name: string;
}
interface DropdownProps {
  items: DropdownListItem[];
  selectedValueId: string | null;
  setSelectedValue: (newValue: DropdownListItem) => void;
  renderTrigger?: (selectedValue: DropdownListItem | null) => ReactNode;
}

export const Dropdown = ({ items, selectedValueId, setSelectedValue, renderTrigger }: DropdownProps) => {
  const selectedValue = useMemo(() => items.find(({ id }) => id === selectedValueId), [items, selectedValueId]);

  return (
    <div className={styles.dropdownWrapper}>
      <Listbox value={selectedValue ?? ""} onChange={setSelectedValue}>
        <Listbox.Button
          as={Button}
          variant="primary"
          className={({ open }) => cn(styles.selectButton, { [styles.isOpen]: open })}
          icon={ChevronDown}
        >
          {renderTrigger ? renderTrigger(selectedValue ?? null) : selectedValue?.name}
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter={styles.transitionEnter}
          enterFrom={styles.transitionEnterFrom}
          enterTo={styles.transitionEnterTo}
          leave={styles.transitionLeave}
          leaveFrom={styles.transitionLeaveFrom}
          leaveTo={styles.transitionLeaveTo}
        >
          <Listbox.Options className={styles.optionsWrapper}>
            {items.map((person) => (
              <Listbox.Option
                key={person.id}
                value={person}
                className={({ active }) => cn(styles.listItem, { [styles.isActive]: active })}
              >
                {({ selected }) => (
                  <>
                    {selected ? <Check width={20} /> : <div className={styles.iconFiller} />}
                    {person.name}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
