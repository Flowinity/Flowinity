import { Container, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import React, { useEffect } from "react"
import axios from "../lib/axios"
import GalleryComponent from "../components/Gallery"

export default function Gallery() {
  const supports = {
    multiSelect: true,
    collections: true,
    randomAttachment: true
  }
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [state, setState] = React.useState({
    gallery: [],
    pager: {
      totalPages: 0
    }
  })

  function getItems() {
    axios
      .get("/gallery", {
        params: {
          search: search,
          filter: filter,
          page: page
        }
      })
      .then((res) => {
        setState(res.data)
      })
  }

  useEffect(() => {
    console.count("hmm")
    getItems()
  }, [page])

  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            id="search"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Select
            labelId="filter"
            id="filter"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All of them</MenuItem>
            <MenuItem value="notCollectivized">Not collectivized</MenuItem>
            <MenuItem value="images">Images</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <GalleryComponent
        items={state.gallery}
        supports={supports}
        page={page}
        setPage={setPage}
        filter={filter}
        search={search}
        getItems={getItems}
        paginate={state.pager}
      />
    </div>
  )
}
