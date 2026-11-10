import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/components/elements/dropDown.module.scss";
import FormInput from "../inputs/FormInput";
import { filterOptions } from "../../utils/search/matchText";
import i18n from "../../configuration/i18n";

// A DropDown with a search box: same props as DropDown, so it can replace it as is.
// Click (or Enter / Space / arrow down) opens the list and puts the cursor in the search;
// arrows move, Enter chooses, Escape or a click outside closes.
const SearchableDropDown = ({
  label, text, list = [], onChange, name, value, placeholder = "Select an option", searchPlaceholder,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const matches = filterOptions(list, query);

  const openList = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const choose = (item) => {
    close();
    onChange({ target: { name, value: item } });
  };

  // a click anywhere else closes the list
  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [open]);

  // the highlighted item stays visible while moving with the arrows
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  const onFieldKey = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openList();
    }
  };

  const onSearchKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches[active] !== undefined) choose(matches[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const listId = `${name}-options`;

  return (
    <div className={styles.dropDownContainer} ref={containerRef}>
      <div onClick={() => (open ? close() : openList())}>
        <FormInput
          label={label}
          value={value || ""}
          name={name}
          type="text"
          text={text}
          placeholder={placeholder}
          readOnly
          style={{ cursor: "pointer" }}
          onKeyDown={onFieldKey}
        />
      </div>

      {open && (
        <div className={styles.dropDownList}>
          <input
            className={styles.search}
            type="search"
            autoFocus
            value={query}
            placeholder={searchPlaceholder ?? i18n.t("dropDown.search")}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onSearchKey}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={matches.length ? `${listId}-${active}` : undefined}
            aria-label={label}
          />
          <div id={listId} role="listbox" ref={listRef}>
            {matches.length > 0 ? (
              matches.map((item, index) => (
                <div
                  key={item}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={item === value}
                  className={`${styles.dropDownItem} ${index === active ? styles.active : ""}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item)}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className={styles.noData}>{i18n.t("dropDown.noResults")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropDown;