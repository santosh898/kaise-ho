import { useMemo, useState } from "preact/hooks";
import { getAllWeeks } from "../../utils/localStorage";
import "charts.css";
import { FC } from "preact/compat";
import { RoutableProps, Link } from "preact-router";
import AttributeTrend from "./AttributeTrend";
import { format, parseISO } from "date-fns";

const Past: FC<RoutableProps> = () => {
  const allWeeks = getAllWeeks();

  const attributeNames = useMemo(
    () => Object.keys(allWeeks[0]?.attributes ?? []),
    [allWeeks]
  );

  const [selectedAttribute, setSelectedAttribute] = useState(attributeNames[0]);

  const highsAndLows = useMemo(() => {
    return allWeeks.reverse().map((week, index) => ({
      title: `Week ${allWeeks.length - index}`,
      date: format(parseISO(week.date), "MMM dd"),
      subtitle: `High: ${
        Object.values(week.attributes).filter((v) => v > 5).length
      }, Low: ${Object.values(week.attributes).filter((v) => v <= 5).length}`,
    }));
  }, [allWeeks]);

  return (
    <div>
      <p>
        <Link href="/this-week"> &#8592; This Week</Link>
      </p>
      <select
        value={selectedAttribute}
        onInput={(e) => setSelectedAttribute(e.currentTarget.value)}
      >
        {attributeNames.map((attribute) => (
          <option key={attribute} value={attribute}>
            {attribute}
          </option>
        ))}
      </select>
      <AttributeTrend allWeeks={allWeeks} attribute={selectedAttribute} />
      <div>
        {highsAndLows.map((week) => (
          <div
            style={{
              border: "1px solid",
              borderRadius: 4,
              marginBottom: "10px",
            }}
          >
            <p>
              {week.title} - {week.date}
            </p>

            <p>{week.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Past;
