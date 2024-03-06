import { FC, TargetedEvent, useMemo, useReducer } from "preact/compat";
import { Link, RoutableProps } from "preact-router";
import {
  updateThisWeek,
  getThisWeek,
  // fillDummyData,
} from "../../utils/localStorage";

// Only once on load
// fillDummyData();

const ThisWeek: FC<RoutableProps> = () => {
  const initialState = getThisWeek();

  // Define reducer function
  const reducer = (
    state: typeof initialState,
    action: ReturnType<typeof updateAttribute>
  ) => {
    switch (action.type) {
      case "UPDATE_ATTRIBUTE":
        if (action.attribute in state) {
          const newState = {
            ...state,
            [action.attribute]: action.value,
          };
          updateThisWeek(newState);
          return newState;
        }
        return state;
      default:
        return state;
    }
  };

  // Define action creator function
  const updateAttribute = (attribute: string, value: number) => ({
    type: "UPDATE_ATTRIBUTE",
    attribute,
    value,
  });

  const [attributes, dispatch] = useReducer(reducer, initialState);

  const onAtrributeChange = (e: TargetedEvent<HTMLInputElement, Event>) => {
    dispatch(
      updateAttribute(e.currentTarget.name, parseInt(e.currentTarget.value))
    );
  };

  const attributeNames = useMemo(() => {
    return Object.keys(attributes);
  }, [attributes]);

  return (
    <div>
      <h1>Kaise Ho?</h1>
      <h4>This Week</h4>
      {attributeNames.map((attribute) => (
        <div key={attribute}>
          <p>{attribute}</p>
          <input
            name={attribute}
            type="range"
            value={attributes[attribute]}
            onInput={onAtrributeChange}
            min={0}
            max={10}
            step={0.1}
          />
        </div>
      ))}
      <p>
        <Link href="/past">&#8592; Past Weeks</Link>
      </p>
    </div>
  );
};

export default ThisWeek;
