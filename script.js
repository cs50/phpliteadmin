// Toggles auto increment checkbox when there is an integer primary key
function _toggleAutoIncrement(i) {
    const typesMenu = document.querySelector(`#i${i}_type`);
    const selectedOption = typesMenu.options[typesMenu.selectedIndex].value;
    const autoIncrement = document.querySelector(`#i${i}_autoincrement`);
    if (!autoIncrement)
        return false;

    if (selectedOption == "integer" && document.querySelector(`#i${i}_primarykey`).checked) {
        autoIncrement.disabled = false;
    }
    else {
        autoIncrement.disabled = true;
        autoIncrement.checked = false;
    }
}


const newMenu = `
  <option disabled selected hidden value=""></option>
  <optgroup label="BLOB">
    <option value="bytea">bytea</option>
  </optgroup>
  <optgroup label="INTEGER">
    <option value="smallint">smallint</option>
    <option value="integer">integer</option>
    <option value="bigint">bigint</option>
  </optgroup>
  <optgroup label="NUMERIC">
    <option value="boolean">boolean</option>
    <option value="date">date</option>
    <option value="datetime">datetime</option>
    <option value="numeric">numeric(precision, scale)</option>
    <option value="time">time</option>
    <option value="timestamp">timestamp</option>
  </optgroup>
  <optgroup label="REAL">
    <option value="real">real</option>
    <option value="double precision">double precision</option>
  </optgroup>
  <optgroup label="TEXT">
    <option value="char">char(n)</option>
    <option value="varchar">varchar(n)</option>
    <option value="text">text</option>
  </optgroup>
`;

const typesMenus = document.querySelectorAll("select[name$=_type]");
const form = typesMenus.length && typesMenus[0].closest("form");
const createTable = form && form.action.indexOf("table_create") > -1;

// Override form submission
if (form) {

    // Validate text fields
    form.onsubmit = () => {
        const invalid = [...typesMenus].some(menu => {
            if (menu.options[menu.selectedIndex].value.startsWith("numeric")) {
                if (!/^$|^\d*[1-9]\d*(,\s?\d*[1-9]\d*)?$/.test(menu.nextSibling.value)) {
                    alert("Expected positive precision, scale");
                    return true;
                }

                menu.options[menu.selectedIndex].value = menu.nextSibling.value ? `numeric(${menu.nextSibling.value})` : "numeric";
            }
            else if (menu.options[menu.selectedIndex].value.indexOf("char") > -1) {
                if (!/^\d*[1-9]\d*$/.test(menu.nextSibling.value)) {
                    alert("Expected positive length n");
                    return true;
                }

                menu.options[menu.selectedIndex].value = `${menu.options[menu.selectedIndex].value.replace(/\(.*\)$/, "")}(${menu.nextSibling.value})`;
            }
        });

        if (invalid)
            return false;

        form.submit();
    };
}

// Toggle auto increment when primary key is toggled
document.querySelectorAll("input[name$=_primarykey]").forEach(checkbox => {
    checkbox.addEventListener("change", e => {
        _toggleAutoIncrement(e.target.name.replace(/_primarykey$/, ""));
    });
});

typesMenus.forEach(menu => {

    // Append text field for size
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "164px";
    input.disabled = true;
    menu.parentNode.insertBefore(input, menu.nextSibiling);

    // Toggle text field
    menu.addEventListener("change", () => {
        const selectedOption = menu.options[menu.selectedIndex].value;
        const matches = /\((.*)\)$/.exec(selectedOption);
        if (selectedOption.startsWith("numeric")) {
            input.placeholder = "precision, scale";
            input.disabled = false;
            if (matches && matches[1]) {
                input.value = matches[1];
            }
        }
        else if (selectedOption.startsWith("char") || selectedOption.startsWith("varchar")) {
            input.placeholder = "n";
            input.disabled = false;
            if (matches && matches[1]) {
                input.value = matches[1];
            }
        }
        else {
            input.placeholder = "";
            input.value = "";
            input.disabled = true;
        }
    });

    // Toggle auto increment when data type is changed
    if (createTable) {
        menu.addEventListener("change", e => {
            _toggleAutoIncrement(e.target.name.replace(/_type$/, ""));
        });

        return menu.innerHTML = newMenu;
    }

    // Remember originally selected option
	const selectedOption = menu.options[menu.selectedIndex];

    // Match selected option against char, varchar, numeric
    const charMatches = /^char(\((\d*[1-9]\d*)\))?$/.exec(selectedOption.value);
    const varcharMatches = /^varchar(\((\d*[1-9]\d*)\))?/.exec(selectedOption.value);
    const numericMatches = /^numeric(\((\d*[1-9]\d*(, \d*[1-9]\d*)?)\))?/.exec(selectedOption.value);

    // Update menu items
    menu.innerHTML = newMenu;

    // Update selected option
	const selected = [...menu.querySelectorAll("option")].some(((option, i) => {
        if (option.value.startsWith("char") && charMatches) {
            option.value = selectedOption.value;
            menu.nextSibling.placeholder = "n";
            menu.nextSibling.disabled = false;
            menu.selectedIndex = i;
            if (charMatches[2])
                menu.nextSibling.value = charMatches[2];

            return true;
        }
        else if (option.value.startsWith("varchar") && varcharMatches) {
            option.value = selectedOption.value;
            menu.nextSibling.placeholder = "n";
            menu.selectedIndex = i;
            menu.nextSibling.disabled = false;
            if (varcharMatches[2])
                menu.nextSibling.value = varcharMatches[2];

            return true;
        }
        else if (option.value.startsWith("numeric") && numericMatches) {
            option.value = selectedOption.value;
            menu.nextSibling.placeholder = "precision, scale";
            menu.nextSibling.disabled = false;
            menu.selectedIndex = i;
            if (numericMatches[2])
                menu.nextSibling.value = numericMatches[2];

            return true;
        }
        else if (option.value == selectedOption.value)
		{
            input.placegolder = "";
            input.value = "";
            input.disabled = true;
			menu.selectedIndex = i;
			return true;
		}
	}));

    // Keep original option selected if does not exist in menu
	if (!selected) {
		menu.innerHTML = `${selectedOption.outerHTML} ${menu.innerHTML}`;
        menu.selectedIndex = 0;
    }
});
