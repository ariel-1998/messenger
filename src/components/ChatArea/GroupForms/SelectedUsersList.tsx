// import React, { useRef, useState } from "react";
// import { UserModel } from "../../../models/UserModel";
// import { Box, Stack, Typography } from "@mui/material";
// import SelectedUser from "./SelectedUser";

// interface SelectedUsersListProps {
//   users: UserModel[];
//   setSelectedUsers: (user: UserModel) => void;
// }

// const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
//   users,
//   setSelectedUsers,
// }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   const handleScroll = (scrollOffset: number) => {
//     const container = containerRef.current;
//     if (!container) return;
//     console.log(scrollOffset);
//     const maxScrollLeft = container.scrollWidth - container.clientWidth;
//     // Calculate the new scroll position
//     let newScrollLeft = scrollLeft + scrollOffset;
//     newScrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
//     setScrollLeft(newScrollLeft);
//   };

//   const RightBtn = () => {
//     const container = containerRef.current;
//     if (!container) return;
//     const maxScrollLeft = container.scrollWidth - container.clientWidth;

//     if (scrollLeft === maxScrollLeft) return null;
//     return (
//       <button
//         style={{
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           right: 0,
//           zIndex: 1,
//         }}
//         onClick={() => {
//           if (!containerRef.current) return;
//           handleScroll(containerRef.current?.clientWidth);
//         }}
//       >
//         {">"}
//       </button>
//     );
//   };

//   return (
//     <Stack
//       direction="row"
//       position={"relative"}
//       width={"100%"}
//       spacing={1}
//       textAlign={"center"}
//       sx={{ boxSizing: "border-box", height: 30 }}
//     >
//       {!users.length ? (
//         <Box sx={{ textAlign: "center", width: "100%" }}>
//           <Typography>Select users</Typography>
//         </Box>
//       ) : (
//         <>
//           {scrollLeft !== 0 && (
//             <button
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 bottom: 0,
//                 left: 0,
//               }}
//               onClick={() => {
//                 if (!containerRef.current) return;
//                 handleScroll(-containerRef.current?.clientWidth);
//               }}
//             >
//               {"<"}
//             </button>
//           )}
//           <Stack
//             ref={containerRef}
//             sx={{
//               overflowX: "auto",
//               transform: `translateX(${scrollLeft}px)`,
//               transition: "transform 0.9s ease",
//             }}
//             direction={"row"}
//             width={"100%"}
//           >
//             {users.map((user) => (
//               <SelectedUser
//                 key={user._id}
//                 onDelete={setSelectedUsers}
//                 user={user}
//               />
//             ))}
//           </Stack>
//           <RightBtn />
//         </>
//       )}
//     </Stack>
//   );
// };

// export default SelectedUsersList;

import React, { useRef, useState } from "react";
import { UserModel } from "../../../models/UserModel";
import { Box, Stack, Typography } from "@mui/material";
import SelectedUser from "./SelectedUser";

interface SelectedUsersListProps {
  users: UserModel[];
  setSelectedUsers: (user: UserModel) => void;
}

const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  users,
  setSelectedUsers,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const LeftBtn = () => {
    const container = containerRef.current;
    if (!container || container.scrollLeft === 0) return null;
    return (
      <button
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
        }}
        onClick={() => {
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          let newScrollLeft = Math.min(
            0,
            Math.min(maxScrollLeft, container.clientWidth)
          );
          setScrollLeft(newScrollLeft);
        }}
      >
        {"<"}
      </button>
    );
  };

  const RightBtn = () => {
    const container = containerRef.current;
    if (!container) return;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (scrollLeft === maxScrollLeft) return null;
    return (
      <button
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          zIndex: 1000,
        }}
        onClick={() => {
          const container = containerRef.current;
          if (!container) return;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          let newScrollLeft = Math.max(
            0,
            Math.min(maxScrollLeft, container.clientWidth)
          );
          setScrollLeft(newScrollLeft);
        }}
      >
        {">"}
      </button>
    );
  };

  return (
    <Stack
      direction="row"
      position={"relative"}
      width={"100%"}
      spacing={1}
      textAlign={"center"}
      sx={{ boxSizing: "border-box", height: 30, overflowX: "auto" }}
    >
      {!users.length ? (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography>Select users</Typography>
        </Box>
      ) : (
        <>
          <LeftBtn />
          <Stack
            ref={containerRef}
            sx={{
              overflowX: "scroll",
              transform: `translateX(-${scrollLeft}px)`, // Corrected direction
              transition: "transform 0.9s ease",
            }}
            direction={"row"}
            width={"100%"}
          >
            {users.map((user) => (
              <SelectedUser
                key={user._id}
                onDelete={setSelectedUsers}
                user={user}
              />
            ))}
          </Stack>
          <RightBtn />
        </>
      )}
    </Stack>
  );
};

export default SelectedUsersList;
