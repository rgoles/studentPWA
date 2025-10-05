import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useRef } from "react";
export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const constraintsRef = useRef(null);
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <motion.div
          ref={constraintsRef}
          className="flex h-10 w-52 items-center justify-center border border-blue-200"
        >
          <motion.div
            drag={"x"}
            dragSnapToOrigin
            dragConstraints={constraintsRef}
            animate={{ rotate: 360 }}
          >
            Hello "/test"!
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
