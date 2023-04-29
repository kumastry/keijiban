import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";

const PaginationForKeijiban = ({
  totalItemCount,
  take,
  page,
  handlePaginationChange,
}) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Box component="pagination" sx={{}}>
        <Pagination
          count={Math.floor((totalItemCount + take - 1) / take)}
          onChange={handlePaginationChange}
          shape="rounded"
          color="primary"
          page={page}
        />
      </Box>
    </Grid>
  );
};

export default PaginationForKeijiban;
