import { FC, useCallback, useReducer } from "preact/compat";
import { Link, RoutableProps } from "preact-router";
import {
  updateThisWeek,
  getThisWeek,
  // fillDummyData,
} from "../../utils/localStorage";
import RadarChart from "./RadarChart";

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

  const onAttributeChange = useCallback(
    (attributeName: string, value: number) => {
      dispatch(updateAttribute(attributeName, value));
    },
    []
  );

  return (
    <div>
      <h1>Kaise Ho?</h1>
      <h4>This Week</h4>
      <RadarChart
        attributes={attributes}
        onAttributesChange={onAttributeChange}
      />
      <p>
        <Link href="/past">&#8592; Past Weeks</Link>
      </p>
    </div>
  );
};

export default ThisWeek;
