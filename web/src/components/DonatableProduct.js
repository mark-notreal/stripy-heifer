import React from "react";
import MaskedItem from "react-text-mask";
import { FormattedNumber, IntlProvider } from "react-intl";

// A very basic component to display table rows of product info.
export default function DonatableProduct({
  index,
  name,
  price,
  currency,
  quantity,
  onQuantityChange
}) {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <IntlProvider locale="en">
          <FormattedNumber
            value={price}
            style={`currency`}
            currency={currency}
          />
        </IntlProvider>
      </td>
      <td>
        <MaskedItem
          mask={[/[1-9]/, /\d/]}
          value={quantity}
          guide={false}
          onChange={e => onQuantityChange(index, e.target.value)}
          style={{ width: 20 }}
        />
      </td>
    </tr>
  );
}
