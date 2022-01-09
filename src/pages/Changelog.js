import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

const Changelog = (props) => {

  const changelog = [
    {
      name: "Version 1",
      description: <p>
        The initial launch of the application with basic functionality, including:
        <ul>
          <li> Ability to add, edit, and delete cars </li>
          <li> Image upload and deletion for cars </li>
          <li> Create and apply scheduled service types to cars </li>
          <li> See upcoming maintenance and overdue maintenance for your cars (based on the scheduled service types applied to the car) </li>
          <li> Piechart containing breakdown of cost on each car </li>
          <li> View and edit each car's scheduled service log and repair log </li>
        </ul>
      </p>,
      tags: [
        {name: "Release", variant: "success"}
      ],
      date: "January 2021"
    },
    {
      name: "Version 1.1",
      description: <p>
        Bug fixes and enhancements from user feedback, including:
        <ul>
          <li> New menu for profile button dropdown </li>
          <li> Added a changelog (the one you are reading right now) </li>
          <li> Fixed bug indicating upcoming maintenance is overdue when it really is not </li>
        </ul>
      </p>,
      tags: [
        {name: "Bug Fix", variant: "warning"},
        {name: "Enhancement", variant: "info"}
      ],
      date: "August 20, 2021"
    }
  ];

  return (
    <Container>
      <br/>
      <Row>
        <Col>
          <h2 style = {{height: "50px"}}> AutoHub Changelog </h2>
        </Col>
      </Row>
      <hr />
      {changelog.map((entry, index) => {
        return (
          <div>
            <Row key={index}>
              <Col xs={12}>
                <h4> {entry.name} </h4>
              </Col>
              <Col xs={12} style = {{marginBottom: "5px"}}>
                <p> <i> Posted {entry.date} </i> </p>
              </Col>
              <Col xs={12}>
                {entry.description}
              </Col>
              <Col xs={12}>
                <p>
                  Tags:
                  {entry.tags.map((tag) => {
                    return (
                      <Badge style = {{marginLeft: "8px"}} variant={tag.variant}> {tag.name} </Badge>
                    );
                  })}
                </p>
              </Col>
            </Row>
            {changelog.length > 1 ?
              <hr />
            :
              <div></div>
            }
          </div>
        );
      })}
    </Container>
  );
}

export default Changelog;
