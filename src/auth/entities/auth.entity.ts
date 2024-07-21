import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty({
    description: 'User JWT Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvaGFjaDIyQG1haWwucnUiLCJpZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjE1MTU3MjYsImV4cCI6MTcyMTUyMjkyNn0.k8SgAsjOl2EsmqIbwclWAbJfQF4evdRwpsO9DtE3P34',
  })
  jwtToken: string;
}
