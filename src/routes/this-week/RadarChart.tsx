import { useEffect, useRef } from "preact/hooks";
import { Update } from "../../utils/localStorage";

interface RadarChartProps {
  attributes: Update["attributes"]; //localStorage Data
  onAttributesChange: (attributeName: string, value: number) => void; // I dont get this 
}

const WIDTH = 1200;
const HEIGHT = 1200;

const colors = [ 
  "red",
  "green",
  "blue",
  "purple",
  "teal",
  "deeppink",
  "indigo",
  "magenta",
  "limegreen",
  "fuchsia",
  "teal",
  "gold",
]; //Will be updating this accordingly 

const RadarChart = ({ attributes, onAttributesChange }: RadarChartProps) => { 
  const ref = useRef<HTMLCanvasElement>(null); //ref for the canvas, to update localStorage whenever there is a change noted

  const getCoordsFromAngle = (
    x: number,
    y: number,
    length: number,
    angle: number
  ) => {
    const radians = angle * (Math.PI / 180);
    const x2 = x + Math.cos(radians) * length;
    const y2 = y + Math.sin(radians) * length;
    return [x2, y2, radians];
  };

  const drawLineAtAngle = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    length: number,
    angle: number,
    color = "black"
  ) => {
    const [x2, y2] = getCoordsFromAngle(x1, y1, length, angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    return [x2, y2];
  };

  const drawDot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  };

  const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x1: number,
    y1: number,
    length: number,
    angle: number,
    color: string
  ) => {
    const [x, y, radians] = getCoordsFromAngle(x1, y1, length, angle);

    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.font = "35px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 50);
    ctx.rotate(-radians);
    ctx.translate(-x, -y);
  };

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const attributeNames = Object.keys(attributes);

    const minAngle = 360 / attributeNames.length;
    const minLength = (WIDTH * 0.4) / 10;

    const [centerX, centerY] = [WIDTH / 2, HEIGHT / 2];

    const dotPositions = attributeNames.map((attribute, index) => {
      drawLineAtAngle(
        context,
        centerX,
        centerY,
        WIDTH * 0.4,
        minAngle * (index + 1),
        "rgba(0,0,0,0.2)"
      );

      drawText(
        context,
        attribute,
        centerX,
        centerY,
        WIDTH * 0.2,
        minAngle * (index + 1),
        colors[index]
      );

      const [dotX, dotY] = drawLineAtAngle(
        context,
        centerX,
        centerY,
        Math.max(minLength * attributes[attribute], 60),
        minAngle * (index + 1),
        colors[index]
      );
      drawDot(context, dotX, dotY, colors[index]);
      return { x: dotX, y: dotY, angle: minAngle * (index + 1) };
    });

    const findDotIndex = (x: number, y: number) => {
      return dotPositions.findIndex(
        (dot) => Math.abs(dot.x - x) <= 20 && Math.abs(dot.y - y) <= 20
      );
    };

    let moveListener: ((moveEvent: MouseEvent) => void) | null = null;
    let upListener: (() => void) | null = null;

    const listener = (event: MouseEvent) => {
      const {
        x: canvasX,
        y: canvasY,
        width: clientWidth,
        height: clientHeight,
      } = canvas.getBoundingClientRect();
      const x = (event.clientX - canvasX) * (WIDTH / clientWidth);
      const y = (event.clientY - canvasY) * (HEIGHT / clientHeight);
      const dotIndex = findDotIndex(x, y);
      if (dotIndex > -1) {
        const dot = dotPositions[dotIndex];
        moveListener = (moveEvent: MouseEvent) => {
          const movedX = (moveEvent.clientX - canvasX) * (WIDTH / clientWidth);
          const movedY =
            (moveEvent.clientY - canvasY) * (HEIGHT / clientHeight);

          const [endX, endY] = getCoordsFromAngle(
            centerX,
            centerY,
            -WIDTH / 2,
            dot.angle
          );

          const newLength = getDistance(endX, endY, movedX, movedY) - centerX;
          const attributeValue = Math.round(newLength / minLength);
          onAttributesChange(
            attributeNames[dotIndex],
            Math.min(attributeValue, 10)
          );
        };
        canvas.addEventListener("mousemove", moveListener);

        upListener = () => {
          if (moveListener) {
            canvas.removeEventListener("mousemove", moveListener);
          } else if (upListener) {
            canvas.removeEventListener("mouseup", upListener);
          }
        };
        canvas.addEventListener("mouseup", upListener);
      }
    };
    canvas.addEventListener("mousedown", listener);
    return () => {
      canvas.removeEventListener("mousedown", listener);
    };
  }, [attributes, onAttributesChange]);

  return (
    <canvas
      style={{ width: 400, height: 400 }}
      ref={ref}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};

export default RadarChart;
