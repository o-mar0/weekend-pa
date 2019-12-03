require 'test_helper'

class TemplatesControllerTest < ActionDispatch::IntegrationTest
  test "should get template" do
    get templates_template_url
    assert_response :success
  end

end
