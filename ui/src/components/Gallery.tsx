import {
  Grid,
  CardActions,
  Card,
  CardMedia,
  Typography,
  Button,
  Pagination,
  CardContent,
  CardActionArea
} from "@mui/material"

interface Upload {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function Gallery(props: {
  items: object[]
  search: string
  filter: string
  supports: { multiSelect: boolean; collections: boolean; randomAttachment: boolean }
  page: number
  setPage: (page: number) => void
  getItems: () => void
  paginate: {
    totalPages: number
  }
}) {
  return (
    <>
      <Grid container spacing={2}>
        {props.items.map((item: any) => (
          <Grid item xs={4} key={item.id}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="180"
                  image={`https://i.troplo.com/i/${item.attachment}`}
                  alt={item.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination count={props.paginate.totalPages} page={props.page} onChange={(e, page) => props.setPage(page)} />
    </>
  )
}
